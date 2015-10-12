---
layout: default
title: JavaScript 代码性能优化总结
tags: [javascript]
---

# 尽量使用源生方法

javaScript是解释性语言，相比编译性语言执行速度要慢。浏览器已经实现的方法，就不要再去实现一遍了。另外，浏览器已经实现的方法在算法方面已经做了很多优化。

避免全局查找

在一个函数中会用到全局对象存储为局部变量来减少全局查找，因为访问局部变量的速度要比访问全局变量的速度更快些。

	// bad
	function search(){
		alert(window.location.host + window.location.href)
	}

	// good
	function search(){
		var location = window.location;
		alert(location.host + location.href);
	}



# 尽量减少循环次数

少一层循环，就能提高数倍性能。如果要对一个数组的每个元素进行多次操作，尽可能使用一次循环，多次操作，而不是多次循环，每次循环执行一次操作。尤其是在进行多个正则匹配的时候，尽可能合并正则表达式，在一次遍历中尽可能找到相应的匹配。

循环

	// 通常循环的写法

	var objs = [obj1,obj2,obj3],
		len  = objs.length;

	for( var i = 0;i<len;i++){
		dosth(objs[i]);
	}

	// 当循环遍历的对象是obj时，可以采用下面的方式

	var objs =  [obj1,obj2,obj3],
		len  = objs.length,
		i = 0;

	while(obj = objs[i++]) {
		dosth(obj);
	}

switch

	// 通常的写法

	function funa() {}
	function funb() {}
	function func() {}

	switch(con) {
		case 'a':
			funa();
			break;
		case 'b':
			funb();
			break;
		case 'c':
			func();
			break;
	}

	// 换种写法
	function funa() {}
	function funb() {}
	function func() {}

	var funs = {
		'a': funa,
		'b': funb,
		'c': func
	}

	funs[con]();

	// Tip: 取值或者函数调用都可以用类似的方法来做



# 条件分支

将条件分支，按可能性顺序从高到低排列：可以减少解释器对条件的探测次数。

在同一条件 >2条件分支时，使用switch优于if：switch分支选择的效率高于if，在IE下尤为明显。4条分支的测试，IE下switch的执行时间约为if的一半。

使用三目运算符替代条件分支。

	if(a > b) {
		num = a;
	} else {
		num = b;
	}

	// 使用三目运算符

	num = a>b ? a : b;


定时器

如果针对的是不断运行的代码，不应该使用setTimeout，而应该是用setInterval，因为setTimeout每一次都会初始化一个定时器，而setInterval只会在开始的时候初始化一个定时器。

	var timeoutTimes = 0;
	function timeout() {
		timeoutTimes++;
		if(timeoutTimes < 10) {
			setTimeout(timeout,10);
		}
	}
	timeout();

	// 可以替换为

	var intervalTimes = 0;
	function interval() {
		intervalTimes++；
		if(intervalTimes >= 10){
			clearInterval(interv);
		}
	}
	var interv = setInterval(interval,10);

创建对象的另外一个办法-不使用new

	// 我们要连续创建一些简单的object对象，并且拥有默认的属性，会这样写：
	function jason() {
		this.propa = '';
		this.porpb = [];
		this.propc = 0;
	}
	var objs = [],
		i    = 0,
		obj;
	while(i<100) {
		obj = new jason();
		obj.propc = i;
		objs.push(obj);
	}

	// 换种写法
	function jason() {
		return {
			propa : '',
			porpb : [],
			propc : 0;
		}

	}
	var objs = [],
		i    = 0,
		obj;
	while(i<100) {
		obj = jason();
		obj.propc = i;
		objs.push(obj);
	}
	// tips: 直接声明的方式，复用性能会差一些。

# 用做标记的变量尽可能使用布尔类型

直接用true和false做标记，不要使用数字或者字符串的1和0来做标记。
