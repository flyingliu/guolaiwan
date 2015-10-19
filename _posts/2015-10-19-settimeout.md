---
layout: default
title: 从setTimeout说事件循环模型
tags: [javascript]
---

1.从setTimeout说起

setTimeout()方法不是ecmascript规范定义的内容，而是属于BOM提供的功能。查看w3school对setTimeout()方法的定义，setTimeout() 方法用于在指定的毫秒数后调用函数或计算表达式。

语法setTimeout(fn,millisec)，其中fn表示要执行的代码，可以是一个包含javascript代码的字符串，也可以是一个函数。第二个参数millisec是以毫秒表示的时间，表示fn需推迟多长时间执行。

调用setTimeout()方法之后，该方法返回一个数字，这个数字是计划执行代码的唯一标识符，可以通过它来取消超时调用。

起初我对 setTimeout()的使用比较简单，对其运行机理也没有深入的理解，直到看到下面代码

	var start = new Date;
	setTimeout(function(){
	var end = new Date;
	console.log('Time elapsed:', end - start, 'ms');
	}, 500);
	while (new Date - start < 1000) {};

在我最初对setTimeout()的认识中，延时设置为500ms，所以输出应该为Time elapsed: 500 ms。因为在直观的理解中，Javascript执行引擎，在执行上述代码过程中，应当是一个由上往下的顺序执行过程，setTimeout函数是先于while语句执行的。可是实际上，上述代码运行多次后，输出至少是延迟了1000ms。

2.根据结果找原因

看过了Java.util.Timer对类似setTimeout()的实现方案，继续回到前文Javascript的setTimeout()方法中，再来看看之前的输出为什么与预期不符。

	var start = new Date;
	setTimeout(function(){
	var end = new Date;
	console.log('Time elapsed:', end - start, 'ms');
	}, 500);
	while (new Date - start < 1000) {};

通过阅读代码不难看出，setTimeout()方法执行在while()循环之前，它声明了“希望”在500ms之后执行一次匿名函数，这一声明，也即对匿名函数的注册，在setTimeout()方法执行后立即生效。 代码最后一行的while循环会持续运行1000ms， 通过setTimeout()方法注册的匿名函数输出的延迟时间总是大于1000ms， 说明对这一匿名函数的实际调用 被while()循环阻塞了，实际的调用 在while()循环阻塞结束后才真正执行。

而在Java.util.Timer中，对于定时任务的解决方案是通过多线程手段实现的，任务对象存储在任务队列，由专门的调度线程，在新的子线程中完成任务的执行。通过schedule()方法注册一个异步任务时，调度线程在子线程立即开始工作，主线程不会阻塞任务的运行。

这就是Javascript与Java/C#之类语言的一大差异，**即Javascript的单线程机制**。在现有浏览器环境中，Javascript执行引擎是单线程的，主线程的语句和方法，会阻塞定时任务的运行，执行引擎只有在执行完主线程的语句后，定时任务才会实际执行，这期间的时间，可能大于注册任务时设置的延时时间。在这一点上，Javascript与Java/C#的机制很不同。

3.事件循环模型

在单线程的Javascript引擎中，setTimeout()是如何运行的呢，这里就要提到浏览器内核中的事件循环模型了。简单的讲，在Javascript执行引擎之外，有一个任务队列，当在代码中调用setTimeout()方法时，注册的延时方法会交由浏览器内核其他模块（以webkit为例，是webcore模块）处理，当延时方法到达触发条件，即到达设置的延时时间时，这一延时方法被添加至任务队列里。这一过程由浏览器内核其他模块处理，与执行引擎主线程独立，执行引擎在主线程方法执行完毕，到达空闲状态时，会从任务队列中顺序获取任务来执行，这一过程是一个不断循环的过程，称为事件循环模型。

4.webkit中timer的实现

到这里已经可以彻底理解下面代码的执行流程，执行引擎先将setTimeout()方法入栈被执行，执行时将延时方法交给内核相应模块处理。引擎继续处理后面代码，while语句将引擎阻塞了1秒，而在这过程中，内核timer模块在0.5秒时已将延时方法添加到任务队列，在引擎执行栈清空后，引擎将延时方法入栈并处理，最终输出的时间超过预期设置的时间。

	var start = new Date;
	setTimeout(function(){
	var end = new Date;
	console.log('Time elapsed:', end - start, 'ms');
	}, 500);
	while (new Date - start < 1000) {};

前面事件循环模型图中提到的WebAPIs部分，提到了DOM事件，AJAX调用和setTimeout方法，图中简单的把它们总结为WebAPIs，而且他们同样都把回调函数添加到任务队列等待引擎执行。这是一个简化的描述，实际上浏览器内核对DOM事件、AJAX调用和setTimeout方法都有相应的模块来处理，webkit内核在Javasctipt执行引擎之外，有一个重要的模块是webcore模块，html的解析，css样式的计算等都由webcore实现。对于图中WebAPIs提到的三种API，webcore分别提供了DOM Binding、network、timer模块来处理底层实现，这里还是继续以setTimeout为例，看下timer模块的实现。

Timer类是webkit 内核的一个必需的基础组件，通过阅读源码可以全面理解其原理，本文对其简化，分析其执行流程。


通过setTimeout()方法注册的延时方法，被传递给webcore组件timer模块处理。timer中关键类为TheadTimers类，其包含两个重要成员，TimerHeap任务队列和SharedTimer方法调度类。延时方法被封装为timer对象，存储在TimerHeap中。和Java.util.Timer任务队列一样，TimerHeap同样采用最小堆的数据结构，以nextFireTime作为关键字排序。SharedTimer作为TimerHeap调度类，在timer对象到达触发条件时，通过浏览器平台相关的接口，将延时方法添加到事件循环模型中提到的任务队列中。

**TimerHeap采用最小堆的数据结构，预期延时时间最小的任务最先被执行，同时，预期延时时间相同的两个任务，其执行顺序是按照注册的先后顺序执行 。**

	var start = new Date;
	setTimeout(function(){
	console.log('fn1');
	}, 20);
	setTimeout(function(){
	console.log('fn2');
	}, 30);
	setTimeout(function(){
	console.log('another fn2');
	}, 30);
	setTimeout(function(){
	console.log('fn3');
	}, 10);
	console.log('start while');
	while (new Date - start < 1000) {};
	console.log('end while');

上述代码输出依次为

	start while

	end while

	fn3

	fn1

	fn2

	another fn2