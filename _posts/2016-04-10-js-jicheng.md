---
layout: default
title: JavaScript 继承方式的概念
tags: [javascript,new]
---

js 中实现继承有两种常用方式：

*. 原型链继承（对象间的继承）
*. 类式继承（构造函数间的继承）

JavaScript不是真正的面向对象的语言，想实现继承可以用JS的原型prototype机制或者call和apply方法

在面向对象的语言中，可以使用类来创建一个自定义对象，当然ES6中也引入了class来创建类。在这之前，我们需要使用js的原型来创建自定义对象。

##### 类继承是在子类型构造函数的内部调用父类型的构造函数

    function Super (){
        this.colors = ["blue","red"];
    }

    function Sub () {
        Super.call(this);
    }


##### 原型式继承是借助已有的对象创建新的对象，将子类的原型指向父类。

    function Super (id) {
        this.id = id;
    }
    Super.prototype.toString = function () {
        return 'Super' + this.id;
    }

    function Sub (id) {
        this.id = id;
    }

    Sub.prototype = new Super();  // 这句即原型式继承的核心代码


##### 原型链继承

为了让子类继承父类的属性和方法，首先需要定义一个构造函数，然后将父类的实例赋值给构造函数的原型。

    function Parent () {
        this.name = 'Parent';
    }

    function Child () {
        this.age = 10;
    }
    Chid.prototype = new Parent();  // Chid继承Parent,形成原型链

    var test = new Child();
    console.log(test.name) // Parent
    console.log(test.age)  // 10    得到被继承的属性

    // 继续原型链继承
    function Brother () {
        this.weight = 60;
    }
    Brother.prototype = new Child();
    var peter = new Brother();
    console.log(peter.name)  //继承了Child和Parent,输出Parent
    console.log(peter.age)  // 输出10

所有的构造函数都继承自Object,它是自动完成继承的并不需要我们手动继承，那么接着看它们的从属关系

##### 确定原型和实例的关系

可以通过两种方式确定原型和实例的关系，通过操作符instanceof和isPrototypeof()方法

    console.log(peter instanceof Object); //true
    console.log(test instanceof Brother)  //false,test是brother的父类
    console.log(peter instanceof Child) //true
    console.log(peter instanceof Parent)  //true

只要是原型链中出现过的原型，都可以说是改原型链派生的实例的原型。因此，isProtptypeof()方法也会返回true

在JS中，被继承的函数成为父类（或者 基类、超类），继承的函数成为子类（派生类）。使用原型继承主要有两个问题，一是字面量重写原型会中断关系，使用引用类型的原型，并且子类型无法给父类型传递参数。

伪类解决引用共享和超类型无法传参的问题，我们可以采用'类式继承'的方式

##### 类式继承(借用构造函数)

    function Parent (age) {
        this.colors = ["blue","red","green"];
        this.age = age;
    }

    function Child (age) {
        Parent.call(this,age);
    }

    var peter = new Child(20);
    console.log(peter.age) //20
    console.log(peter.colors) //blue,red,green

    peter.colors.push("white");
    console.log(peter.colors) //blue,red,green,white

借用构造函数虽然解决了上面两张问题，但没有原型，所以我们需要原型链+借用构造函数的模式，这种模式成为组合继承

##### 组合继承

    function Parent (age) {
        this.colors = ["blue","red","green"];
        this.age = age;
    }

    Parent.prototype.run = function () {
        return this.colors + ' is ' +this.age;
    }
    function Child (age) {
        Parent.call(this,age);  //对象冒充，给父类型传参
    }
    Child.prototype = new Parent();  //原型链继承

    var peter = new Child(20);
    console.log(peter.run()); //blue,red,green is 20

组合继承是一种比较常用的方法，思路是使用原型链实现对原型属性和方法的继承，借用构造函数来实现对实例属性的继承。这样，既实现了原型上定义方法的函数复用，又保证每个实例都有自己的属性。

call()与apply()的用法：调用一个对象的一个方法，用另一个对象替换当前对象。

    call(thisObj,Object);  // call接收一个对象
    apply(thisObj，[argArray])  //apply接收一个数组

##### 原型式继承

这种继承借助原型并基于已有的对象创建新的对象，同时还不用创建自定义类型的方式成为原型式继承

    function obj(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }

    var box = {
            name : 'peter',
            arr : ['blue','red','green']
        };

    var b1 = obj(box);
    console.log(b1.name) // peter

    b1.name = 'jack';
    console.log(b1.name) //jack

    console.log(b1.arr) //blue,red,green
    b1.arr.push('white') //blue,red,green,white

    var b2 = obj(box);
    console.log(b2.name) // peter
    console.log(b1.arr) //blue,red,green


原型式继承首先在obj()

函数内部创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回这个临时类型的新实例。

##### 寄生式继承

这种继承方式是把原型式+工厂模式结合起来，目的是为了封装创建的过程。

    function create(o){
            var f = obj(o);
            f.run = function () {
                return this.arr;//同样，会共享引用
            };
            return f;
        }

##### 组合式继承的问题

组合式继承是JS最常用的继承模式，但组合继承的父类型会在使用过程中被调用两次，一次是创建子类型的时候，另一次是在子类型构造函数的内部

    function Parent(name){
            this.name = name;
            this.arr = ['哥哥','妹妹','父母'];
        }

        Parent.prototype.run = function () {
            return this.name;
        };

        function Child(name,age){
            Parent.call(this,age);//第二次调用
            this.age = age;
        }

        Child.prototype = new Parent();//第一次调用

以上代码是组合继承，那么寄生组合继承解决了两次调用的问题

##### 寄生组合继承

    function obj() {
        function F() {}
        F.prototype = o;
        return new F();
    }
    function create(parent,test) {
        var f = obj(parent.prototype); //创建对象
        f.constructor = test; //增强对象
    }
    function Parent(name){
            this.name = name;
            this.arr = ['brother','sister','parents'];
        }

    Parent.prototype.run = function () {
            return this.name;
        };

    function Child(name,age){
            Parent.call(this,name);
            this.age =age;
        }
    inheritPrototype(Parent,Child);  //通过这里实现继承

    var test = new Child('peter',20);
    test.arr.push('new');
    console.log(test.arr);  //brother,sister,parents,new
    console.log(test.run());  //只共享了方法

    var test2 = new Child('jack',22);
    console.log(test2.arr);  //引用问题解决

##### call和apply

call和apply可以用来改变函数中this的指向:

    // 定义一个全局函数
    function f () {
        console.log(this.name);
    }
    // 定义一个全局变量
    var name = 'peter';
    var obj = {
        name: 'jack';
    };

    f.apply(window); //apple, 此时this 等于window  相当于window.f()
    f.apply(obj);  //jack, 此时this === obj 相当于obj.f()






