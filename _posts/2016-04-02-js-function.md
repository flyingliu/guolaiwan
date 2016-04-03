---
layout: default
title: JS中特殊的对象——函数
tags: [javascript,function]
---

由于函数是对象，继承自object，因此函数名实际上是一个指向函数对象的指针。

使用函数声明的语法定义：

    function sum(num1,num2)
    {
        return num1+num2;
    }
这种声明方法，使得sum的类型为function型。

使用函数表达式定义函数：

    var sum=function(num1,num2){
        return num1+num2;
    }

这种方法，定义了变量sum并将其初始化为一个函数。通过变量sum就可以引用函数，这样可以通过变量将函数赋值给其他变量使用这一个函数。不用再声明同功能的函数了。

使用Function构造函数:

    var sum=new  Function("num1","num2","return num1+num2");

不推荐，这种语法会导致解析两次代码。一次是常规代码，依次是字符串。

【补充】说一下，第二种方法，由于函数名仅仅是指向函数的指针，所以一个函数可能会有多个名字。

    var anothersum=sum;
    sum=null;
    var s=anothersum(1,2);//3

当sum后面不带括号的时候，是赋值，即让anothersum也指向该函数实例。而当将sum置空，即sum不指向该函数实例，我们发现也完全不影响anothersum指向。

function没有重载

重载是指将函数设置不同的参数个数或类型，当实际调用函数时，根据参数的个数或类型来选择适合的函数。（我说的白话）

原因

函数名想象为指针后，

    function sum(num1,num2)
    {
        return num1+num2;//+
    }
    var sum=function(num1,num2){
        return num1-num2;//-
    };
    alert(sum(1,2));//-1


发现第二个函数覆盖了第一个函数，原因是因为sum被指向了另一个实例化的函数对象。

弥补

当程序想要通过根据参数的个数实现重载时，我们可以借助函数的内部属性：arguments

在函数内部有两个而特殊的对象，this与arguments。

arguments与函数的参数有关，js函数的参数与其他语言中函数的参数有所不同，js不介意传递进来多少个参数，也不在乎传进来的参数是什么数据类型，这样一听，貌似重载没得救了，因为似乎无论形参设置多少个，都没关系，调用该函数时肯定会调用他。而实参传递多少似乎函数都可以获得，这就要通过arguments啦.

arguments其主要用途是用来保存函数参数。

     arguments[0]//表示传递的第一个元素
     arguments[1]//表示传递的第二个元素
      ……//与数组类似，但是并不是Array的实例哦

可以通过 arguments.length的值来判断实参的个数。进而可以通过if语句来判断语句的执行情况。

需要注意的是，即使形参可有可无，但是，既然提供了这个功能，那么他必然和arguments之间有一定的关系，即二者之中哪一个被修改了，都会影响到对方的值，但是二者并不是指向同一个内存空间。

arguments这个对象还有一个属性：callee，该属性是一个指针，指向拥有arguments对象的函数。

这个属性有一个经典的作用：看这个函数

function factorial(num){
  if(num<=1){
      return 1;
  }
  else{
      return num*factorial(num-1);
  }
}
alert(factorial(5));//120

这是一个计算阶乘的递归函数，发现函数内部使用了变量factorial，但是事实上一个实例化的函数对象可以拥有很多个名字，但是这样写似乎使得这个递归函数只能效力于名字是factorial的啦，

【解决方法】

    //将
    return num*factorial(num-1);
    //替换为
    return num*arguments.callee(num-1);

this对象

函数内部的另一个特殊对象，

this是js的一个关键字，其的值会跟着环境的不同而不同。

但是有一个原则，this指的是调用函数的那个对象，更精准的this引用的是函数据以执行的环境对象。

当在网页全局作用域中调用时，this对象引用的就是window。

caller这个属性虽然在ECMAScript 3并没有定义这个属性，但是这个属性中保存着调用当前函数的函数的引用。

    function outer(){
      inner();
    }
    function inner(){
      alert(arguments.callee.caller)
    }
    outer()//显示outer函数的源代码

函数的属性和方法

除了前面提到的函数内部的两个特殊对象，在函数外部，我们还可以通过：函数名.函数的属性名或方法名的模式调用函数的属性和方法。

属性length

表示每个函数准备接收的命名参数的个数，即形参的个数，区别于内部对象arguments是实参的个数。

    function sum(num1,num2,num3)
    {
       alert(arguments.callee.length);//方法2：内部对象调用
    }
    sum(1,2)
    alert(sum.length);//方法1：函数调用

属性prototype

这个属性即为原型属性，在创建自定义类型及实现继承时，该属性的作用极为重要。

方法apply()与方法call()

这两个方法是非继承而来的，所以也就是鼻祖object对象可没有这两个方法。这两个方法的用途都是在特定的作用域中调用函数，实际上设置函数体内this对象的值。等等！this对象的值！

    var obj={name:"dudu";}; 
    var ss=function(){alert(this.name)};
    obj.showname=ss;

此时ss所指向的函数内部的this的是obj。这个是我们常见的修改this对象值的方法。
js通过为函数提供这两个方法，也可以实现修改函数this对象的方法

apply方法 有两个参数，1个是在其中运行函数的作用域，另一个是参数数组。

    function sum(num1,num2)
    {
        return num1+num2;
    }
    function callsum(num1,num2)
    {
        return sum.apply(this,arguments);
        return sum.apply(this,[num1,num2]);//效果一样，数组！！
    }
    alert(callsum(10,10))//20

callsum里面的this，由于callsum是在全局作用域下被调用，所以this是windows对象，即为sum函数创造一个全局作用域。第二个参数是arguments，即callsum的参数，并将它作为sum 的参数。apply所在的那句代码翻译下来就是在全局环境下：sum（10,10）;

call方法，与apply方法的作用一样，但是接收参数的方式不同，其参数必须逐个例出来

    return sum.call(this,num1,num2);

以上这两个例子并没有看出来他们的作用，看下一个例子。

    /*定义一个属于两个对象的属性red*/
    window.color='red';
    var o={color:"blue"};
    /*this的值取决于调用他的对象，*/
    function sayColor(){
        alert(this.color);
    }
    /*将作用域设为this，即展示window.color*/
    sayColor.call(this);//red
    sayColor.call(window);//red
    /*将作用域设为o，即展示o.color*/
    sayColor.call(o);//blue

使用call()与apply()方法较之前设置this值的方法的好处是对象不需要与方法有任何的关系。上个例子，对象o并没有将saycolor设置为自己的方法，却也可以使用这个函数。

bind方法

    window.color='red';
    var o={color:"blue"};
    /*this的值取决于调用他的对象，*/
    function sayColor(){
        alert(this.color);
    var objectSayColor=sayColor.bind(o);
    objectSayColor();//blue

新创建的函数objectSayColor其this值被绑定了对象o，即使在全局环境下运行，其this值也是对象o。

toString()、toLocalString()、valueOf()这三个也是函数的方法，但是其返回值均为函数的代码，至于代码格式因浏览而异。


