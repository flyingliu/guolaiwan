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