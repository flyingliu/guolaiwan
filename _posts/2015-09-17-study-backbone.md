---
layout: default
title: Backbone的学习[一]
tags: [backbone]
---


这个例子是仿照todo去实现一些任务的。我想慢慢去扩展它，争取把backdone常用的概念能跑一遍。

[实例](/src/demos/study-backbone.html)

backbone中的创建视图

# 用el,id,tagName,className,attributes的区别

	<div title="列表" style="color:red" id="list" class="listview"></div>
	<script type="text/javascript">
		var ListView = Backbone.View.extend({
			el : '#list'
		});
	     var listview = new ListView();
	</script>

**当dom选择器已经存在时用 `el` 指定对应的DOM对象**

在这个例子中，我们定义了一个ListView视图类，它继承自Backbone.View，我们通过new关键字实例化一个ListView对象。

在定义ListView时，我们设置了el属性，它应该是一个字符串形式的DOM选择器，但视图对象在实例化时，会在内部通过这个选择器获取对应的DOM对象，并重新存放在el属性中。因此我们可以在视图的内部通过this.el来访问所关联的DOM对象。

每个视图对象都会关联一个DOM对象，视图中所有操作都限定在这个DOM对象之内，这样做可以便于视图界面的控制（如渲染、隐藏和移除等），同时能提高查找视图内子元素的效率。

上面的例子中，id为list的标签是我们事先准备好的，在定义ListView时可以直接通过#list选择器来引用它，但实际开发时这些DOM可能是动态生成的，至少在定义视图类时它们还不存在。此时，我们可以通过另一种方式来设置视图的DOM对象：

**当dom选择器在定义视图类还不存在时用 `tagName` **

	<script type="text/javascript">
		var ListView = Backbone.View.extend({
	      tagName : 'div',
	      className : 'listview',
	       id : 'list',
	       attributes : {
	           title : '列表',
	           style : 'color:red'
	      },
	      render : function() {
	          this.el.innerHTML = 'Hello World!';
	           document.body.appendChild(this.el);
	       }
		});
		var listview = new ListView();
	    listview.render();
	</script>

运行这个例子，页面上输出了一段红色的文字：Hello World!。如果你通过Firebug等工具查看当前的DOM结构，你能看到body结束标签之前多了这样一段：

	<div title="列表" style="color:red" id="list" class="listview">Hello World!</div>

这段标签是视图对象在实例化时根据`tagName`、`className`、`id`和`attributes`属性自动创建的，结合我们的代码，你可以很清晰地看出：

- tagName表示新标签的名称（如果没有设置，则默为div标签）

- className对应标签的class样式属性

- id对应标签的id属性

这3个是最常见的HTML属性，你可以在定义视图类时直接设置它们，如果还需要设置更多的属性，可以通过attributes属性来定义。

你可能注意到，我们还定义了一个render()方法，在创建ListView实例之后，我们调用该方法将新建的标签添加到页面尾部，否则它只会存储在el属性中，而不会被显示。

上面介绍的两种创建方式，是在两种不同的场景中使用，分别是对已经存在的DOM创建视图，和创建视图时同时创建新的DOM，因此你不应该不会同时使用到它们。