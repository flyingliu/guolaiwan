---
layout: default
title: JS中字符串转布尔值
tags: [javascript]
---

问题：ajax返回的值是字符串“true”和“false”，怎么转成相应的布尔值`true`和`false`
[stackoverflow](http://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript)网站上提出过这个问题

	var myBool = Boolean("false");  // == true
	var myBool = !!"false";  // == true

如果值是字符串“true”和“false”，那么无论怎么强制转换成布尔值，都是布尔值true。有人提出用JSON方法来转，很不错。

	JSON.parse("true"); // == true
	JSON.parse("false");// == false

当然这个值只限于能转成js基本类型的值。

	JSON.parse(str); str为一个标准格式的 JSON 字符串，并返回解析后的 JavaScript 对象。
	JSON.parse('False');  // Uncaught SyntaxError:
	JSON.parse('False'.toLowerCase());  // false,如果不确定大小写可以先转一下;
	!!JSON.parse('null') //false

用jQuery或者zepto,可以用：

	$.parseJSON(str);

