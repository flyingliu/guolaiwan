---
layout: default
title: 使用Backbone
tags: [backbone]
---

# {{page.title}}

[本文代码demo](/src/demos/use-backbone.html)

随着JavaScript程序变得越来越复杂，往往需要一个团队协作开发，这时代码的模块化和组织规范就变得异常重要了。MVC模式就是代码组织的经典模式。backbone.js就是为前端开发提供MVC模式滴！

backebone.js官网介绍
[官方网站](http://backbonejs.org/) ，中文手册可以看 [这里](http://www.css88.com/doc/backbone/)。

官网上面明确指出Backbone.js依赖 [Underscore.js](http://underscorejs.org/) ,中文手册看 [这里](http://learningcn.com/underscore/) ，所以在使用backbone.js的时候，必须引入underscore.js。官网也提供了 [查看源码](http://backbonejs.org/docs/backbone.html) 的地址，文档注释写的非常详细。另外在官网上面都会给出代码示例，在代码的右上角上，有一个运行的按钮，点击的运行就可以看到这段代码运行的结果啦。

官网左侧菜单栏里面就是backbone.js的全部模块了

Events 事件：backbone.js是事件驱动的，可以给对象绑定自定义事件

Model 模型：MVC中的M，对数据的操作都在这里了

Collection 集合：是Model的集合

Router 路由：为客户端路由提供支持，并支持旧浏览器

History 历史：处理hashchange或pushState

Sync 同步：向服务器进行同步，默认同步方式调用的是jQuery.ajax，可以重写Sync修改为其他同步方式

View 视图：含事件行为和渲染页面

Utility 工具：为解决冲突提供工具

F.A.O 问答：常见问答

Examples 案例：backbone.js有很多案例，直接点击就可以查看了


MVC

- （1）**Model**  Model表示数据层，也就是程序需要的数据源，通常使用JSON格式表示。

- （2）**View**  View表示表现层，也就是用户界面，对于网页来说，就是用户看到的网页HTML代码。

- （3）**Controller**  Controller表示控制层，用来对原始数据（Model）进行加工，传送到View。

由于网页编程不同于客户端编程，在MVC的基础上，JavaScript社区产生了各种变体框架MVP（Model-View-Presenter）、MVVM（Model-View-ViewModel）等等，有人就把所有这一类框架的各种模式统称为MV*。

框架的优点在于合理组织代码、便于团队合作和未来的维护，缺点在于有一定的学习成本，且限制你只能采取它的写法。

backbone.js主要内容介绍
Model.constructor

    var tom = new Backbone.Model({'name':'tom'});  // 创建学生tom
    var peter = new Backbone.Model({'name':'peter'}); // 创建学生peter

    var students = new Backbone.Collection(); // tom和peter都是学生
    students.add( tom );    // 向Collection中添加学生
    students.add( peter );

    console.log( JSON.stringify(students) ); //[{"name":"tom"},{"name":"peter"}]

通过new的方式创建了两个Model的实例；通过json对象的传参方式给Model的constuctor构造函数传递了name属性。

通过new的方式创建了一个Collection实例；通过调用students的add方法，将tom和peter添加到集合中。

通过 文档 可以看出，通过{'name':'tom'}这种方式给Model设置的属性，实际上会调用model.set()方法。

Model.extend

    var User = Backbone.Model.extend({
    sayHello : function(){  //实例方法
      console.log("hello");
        }
    },
    {
    sayWorld : function(){  //静态方法
      console.log("world");
        }
    });
    var tom = new User; // 创建一个用户
    tom.sayHello(); // 调用用户的实例方法
    User.sayWorld(); // 直接调用Model的静态方法

通过extend扩展了Backbone.Model，第一个参数是实例对象中的属性，第二个可选的参数会直接注册到构造函数成为静态方法。这样即使没有实例化对象，也能调用Model中定义的方法

    var User = Backbone.Model.extend({
      defaults : {    // 默认属性，但是子类也会继承
        "name": "tom"
      },
      sayHello : function(){  // 父类的方法
        console.log("hello");
      }
    });
    var ChildUser = User.extend({   // ChildUser 继承自User
      sayChild : function(){  // 子类的方法
        console.log("child");
      }
    });
    var child = new ChildUser;  // 创建ChildUser实例
    child.sayHello();    // 子类继承父类sayHello()方法
    child.sayChild();    // 子类自己的方法
    console.log(child.get("name"));  // 子类继承父类属性

extend会正确的设置原型链，所以可以通过extend实现继承。上面的代码就是创建父类User，然后子类ChildUser继承子父类。子类会继承父类的属性、方法

Model.initialize

    var User = Backbone.Model.extend({
      defaults : {
        name : 'tom'  // 默认的名字
      },
      initialize : function(){  //当model创建的时候，调用
        console.log("initialize");
        this.on('change',function(){  // 当数据发生变化的时候触发
          console.log("此时我的名字是："+this.get("name"));
        });
      }
    });
    var tom = new User;
    tom.set('name','jack'); // 修改模型的数据，会被change检测到

如果指定了initialize方法，会在创建实例对象之后调用。当修改了模型数据，会触发自定义事件。

    var User = Backbone.Model.extend({
      defaults : {
        name : 'tom',   // 默认的名字
        age : 10
      },
      initialize : function(){  //当model创建的时候，调用
        console.log("initialize");  
        this.on('change:name',function(){   // 只检测name的变化
          console.log("此时我的名字是："+this.get("name"));
        });
      }
    });
    var tom = new User;
    tom.set('name','jack'); // 修改模型的数据，会被change检测到
    tom.set('age','20');// 修改年龄不会被change检测

如果只想检测某个属性的变化，可以通过添加命名空间的方式区别开事件。

listenTo、View initialize

    $(function(){
      var User = Backbone.Model.extend({
        defaults : {
          name : 'tom'
        }
      });
      var View = Backbone.View.extend({
        initialize : function(){
          console.log("initialize");
          this.listenTo( this.model , 'change' , this.show );  // 当与这个view绑定的model数据发生变化的时候，调用show方法
        },
        show : function(model){ // 向页面中输出信息
          $('body').append( '<div>'+ this.model.get('name')+ '</br>也可以通过参数调用</br>' + model.get('name') +'</div>' );
        }
      });
      var tom = new User;
      var view = new View({model:tom});    // 创建view实体
      setTimeout(function(){
        tom.set('name','jack');  // 修改数据
      }, 1000);    // 一秒后修改数据，触发show
    });

listenTo允许一个对象监听另一个对象的事件，上面的代码就是让view监听model的change事件。

sync、Model.save()

    Backbone.sync = function(method, model) {
      console.log(method + ": " + JSON.stringify(model));
      model.set('id', 1);   // 模型的特殊属性
    };
    var Book = Backbone.Model.extend({
      defaults:{
        title: "The Rough Riders",
        author: "Theodore Roosevelt"
      }
    });
    var b = new Book;
    b.save();    // create: {"title":"The Rough Riders","author":"Theodore Roosevelt"}
    b.save({author: "Teddy"}); // update: {"title":"The Rough Riders","author":"Teddy","id":1}

调用模型的save方法，就是委托Backbone.sync对数据进行持久化处理（保存到数据库），如果验证成功返回jqXHR，否则返回false。sync默认情况下是使用的是jQuery.ajax，可以通过重写sync来使用其他方式进行持久化处理如WebSockets,XML,或者Local Storage。上面的代码就是重写Backbone.sync的过程。第一次save的时候发送的create请求，第二次save的时候发送的是update请求。Backbone是如何区分第一次请求还是第二次请求的呢？是根据通过model.isNew这个方法进行判断的。如果模型没有id属性，就是表示模型是新模型可以通过下面的代码测试

    Backbone.sync = function(method, model) {
      console.log(method + ": " + JSON.stringify(model));
      console.log(model.isNew());   // 此时不存在id属性，所以是true
      model.set('id', 1);   // 模型的特殊属性
      console.log(model.isNew()); // 此时存在id属性，所以是false
    };

在 Model.id文档中指出，如果通过set设置了model的id，就会将这个id拷贝到模型上，作为model的直接属性。在下图中可以发现通过Model.set('id',1)，给attributes中添加了id属性，也直接给model添加了id属性。


但是相反的，如果通过model.id=1的方式直接给model添加id属性，是不会拷贝到attributes中的。如果只是给model直接添加了id，通过Model.isNew返回的一直都会是true。

    Backbone.sync = function(method, model) {
      console.log(method + ": " + JSON.stringify(model));
      console.log(model.isNew());   // 返回true
      model.id=1;   // 给model直接添加id属性
      console.log(model.isNew()); // 返回true
    };


View和Events

    var BodyView = Backbone.View.extend({
      el : $('body'), // 如果没有指定el，el就会是个空div
      events : {
        'click input' : 'sayHello', // 点击input的时候调用sayHello方法
        'mouseover li' : 'moveLi'// 鼠标悬浮li标签的时候调用moveLi方法
      },
      sayHello : function(){
        console.log("Hello");
      },
      moveLi : function(){
        console.log("mouseover li");
      }
    });
    var view = new BodyView;

如果设置了tagName、className、id、attributes属性（为视图知道根元素），那么view.el就会被创建，都在view.el就是个空的div。Backbone.events可以写成对象的形式，给视图绑定一组自定义事件。

template

    var Name = Backbone.Model.extend({
      defaults : {
        name : 'tom'
      }
    });
    var NameView = Backbone.View.extend({
      initialize : function(){
        this.listenTo( this.model , 'change' , this.showName );
      },
      showName : function(model){
        // $('body').append( "<div>" + model.get("name") + "</div>" );    // 不使用template的时候html代码与js写在一起
        $('body').append( this.template(this.model.toJSON()) );
        // 使用模版之后，html代码与js代码相分离
      },
      template: _.template($('#name').html())
      // _.template中传入需要编译的模版
      // 返回的结果就是编译后的html代码
      // 最后在showName中调用，将编译后的html显示到body中
    });
    var name = new Name;
    var nameView = new NameView({model:name});
    name.set('name','jack');
    <script type="text/template" id="name">
      <% for (var i=0;i<5;i++) { %>
        <div><%= name %></div>
      <% } %>
    </script>

使用js模版不仅可以将html代码和js代码分离，提高可读性，也能提高开发效率。backbone.js使用的underscore.js中的template
