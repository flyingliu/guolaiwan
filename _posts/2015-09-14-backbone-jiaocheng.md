---
layout: default
title: Backbone.js 简易入门教程
tags: [backbone]
---

# {{page.title}}

因为最近的工作中使用到了backbone.js框架，所以在网上找了些资料，但是关于这个框架的中文资料实在是太少了，没有办法，只好自己翻译了壹篇简单的入门教材。如果翻译得不好，请大家口下留情。另外，大家也可以签出 [Agility.js](http://agilityjs.com/) 的代码，它也是壹个用于替代Backbone.js的壹个简单框架。

这是壹个简单的 Backbone.js 教程，由不言自明的"Hello World"到日益复杂的例子组成，它的出现是为了提供壹个平滑的从零过渡到流行的 Todos样例。
Backbone.js提供了壹个简化的用于组织你的Javascript应用的MVC框架。目的是为了得到更加容易维护的代码，通过解开那些富客户端应用中类似“意大利面条”式，在DOM的不同部分和后端服务器中的回调绑定。
教程开始于最小化的视图(View)对象，并且逐步的介绍事件绑定、事件处理、模型与集合。壹旦进入教程，可以使用右上角的导航菜单来查看其它例子。例子的序号按照其复杂程度递增。

下面的代码是基于HTML5的页面，最好使用最新版本的Firefox/Chrome/Opera/Safari浏览，不要用IE浏览器，你懂的。

	<!DOCTYPE html>
	 <html>
	 <head>
	   <meta charset="utf-8">
	   <title>hello-backbonejs</title>
	 </head>
	 <body>
	   <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
	   <script src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js"></script>
	   <script src="http://ajax.cdnjs.com/ajax/libs/underscore.js/1.1.6/underscore-min.js"></script>
	   <script src="http://ajax.cdnjs.com/ajax/libs/backbone.js/0.3.3/backbone-min.js"></script>
	   <script src="...number.js..." type="text/javascript"></script>
	 </body>
	 </html>

# 1.js  本例说明最小化的视图的声明与实例化。效果演示看[这里](/src/demos/hello.html)。

ListView类：是我们的主要的应用视图。

initialize()：自动调用上述实例，你可以在这里做除了界面元素事件以外的所有类型的绑定，比如说单击事件等等。

render()：用于渲染整个视图的函数。this.el：需要用户手动调用。

listView实例：实例化整个视图。

	(function($){
	//自运行的闭包
	  var ListView = Backbone.View.extend({
	    el: $('body'), // attaches `this.el` to an existing element.
	    initialize: function(){
	      _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
	       this.render(); // not all views are self-rendering. This one is.
	    },
	    render: function(){
	      $(this.el).append("<ul> <li>hello world</li> </ul>");
	    }
	  });
	  var listView = new ListView();
	})(jQuery);

# 2.js  本例说明如何绑定DOM事件到视图的方法中。效果演示看[这里](/src/demos/hello2.html)。

events：DOM事件绑定到视图方法中，Backbone没有独立的控制器来处理这种绑定，它们全部发生在视图层中。

render()：正在展示如何将壹个按钮来添加到新的list条目中。

addItem()：通过上述点击事件自动触发的自定义的函数。

	(function($){
	  var ListView = Backbone.View.extend({
	    el: $('#mydiv'), // el attaches to existing element
	    events: {
	      'click button#add': 'addItem'
	    },
	    initialize: function(){
	      _.bindAll(this, 'render', 'addItem'); // every function that uses 'this' as the current object should be in here
	      this.counter = 0; // total number of items added thus far
	      this.render();
	    },
	    render: function(){
	      $(this.el).append("<button id='add'>Add list item</button>");
	      $(this.el).append("<ul></ul>");
	    },
	    addItem: function(){
	      this.counter++;
	      $('ul', this.el).append("<li>hello world"+this.counter+"</li>");
	    }
	  });
	  var listView = new ListView();
	})(jQuery);

# 3.js  这个样例说明如何使用模型中的集合来存储数据，以及如何将数据的改变绑定到视图。演示效果看[这里](/src/demos/hello3.html)。

Item 类：模型层的原子（最小）部分。壹个模型是壹个基本的Javascript对象，例如：键值对，以及壹些用于事件响应、数据持久化的帮助函数等。

List 类：壹个条目的集合。基本上是壹些模型对象的数组和壹些帮助函数。

initialize() 正在实例化壹个集合，并且绑定它的添加事件到自己的方法 appendItem。（Backbone不在壹个单独的控制器中提供回调函数用于绑定）。

Save 参考这个以便它能够访问下面的callback范围内的数据。

addItem() 现在独立处理模型与视图。现在视图更新被授予下面的事件监听器 appendItem()。

appendItem() 被集合事件add触发，可视化的处理更新。

	(function($){

	  var Item = Backbone.Model.extend({
	    defaults: {
	      part1: 'hello',
	      part2: 'world'
	    }
	  });

	  var List = Backbone.Collection.extend({
	    model: Item
	  });

	  var ListView = Backbone.View.extend({
	    el: $('body'),
	    events: {
	      'click button#add': 'addItem'
	    },

	    initialize: function(){
	      _.bindAll(this, 'render', 'addItem', 'appendItem'); // remember: every function that uses 'this' as the current object should be in here

	      this.collection = new List();
	      this.collection.bind('add', this.appendItem); // collection event binder

	      this.counter = 0;
	      this.render();
	    },
	    render: function(){

	      var self = this;
	      $(this.el).append("<button id='add'>Add list item</button>");
	      $(this.el).append("<ul></ul>");
	      _(this.collection.models).each(function(item){ // in case collection is not empty
	        self.appendItem(item);
	      }, this);
	    },

	    addItem: function(){
	      this.counter++;
	      var item = new Item();
	      item.set({
	        part2: item.get('part2') + this.counter // modify item defaults
	      });
	      this.collection.add(item); // add item to collection; view is updated via event 'add'
	    },

	    appendItem: function(item){
	      $('ul', this.el).append("<li>"+item.get('part1')+" "+item.get('part2')+"</li>");
	    }
	  });

	  var listView = new ListView();
	})(jQuery);

# 4.js  这个样例说明如何渲染模型到专门查看的视图。演示效果看[这里](/src/demos/hello4.html)。

ItemView 类：负责渲染每个独立的条目。

appendItem() 不再负责渲染独立的项目。它现在授予 render() 方法到每个独立的 ItemView 实例。

	(function($){
	  var Item = Backbone.Model.extend({
	    defaults: {
	      part1: 'hello',
	      part2: 'world'
	    }
	  });

	  var List = Backbone.Collection.extend({
	    model: Item
	  });

	  var ItemView = Backbone.View.extend({
	    tagName: 'li', // name of (orphan) root tag in this.el
	    initialize: function(){
	      _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
	    },
	    render: function(){
	      $(this.el).html('<span>'+this.model.get('part1')+' '+this.model.get('part2')+'</span>');
	      return this; // for chainable calls, like .render().el
	    }
	  });

	  var ListView = Backbone.View.extend({
	    el: $('body'), // el attaches to existing element
	    events: {
	      'click button#add': 'addItem'
	    },
	    initialize: function(){
	      _.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object
	      this.collection = new List();
	      this.collection.bind('add', this.appendItem); // collection event binder

	      this.counter = 0;
	      this.render();
	    },
	    render: function(){
	      var self = this;
	      $(this.el).append("<button id='add'>Add list item</button>");
	      $(this.el).append("<ul></ul>");
	      _(this.collection.models).each(function(item){ // in case collection is not empty
	        self.appendItem(item);
	      }, this);
	    },
	    addItem: function(){
	      this.counter++;
	      var item = new Item();
	      item.set({
	        part2: item.get('part2') + this.counter // modify item defaults
	      });
	      this.collection.add(item);
	    },

	    appendItem: function(item){
	      var itemView = new ItemView({
	        model: item
	      });
	      $('ul', this.el).append(itemView.render().el);
	    }
	  });

	  var listView = new ListView();
	})(jQuery);

# 5.js  本例介绍两个新的模型动作（交换与删除） 说明这些动作应该如何在模型的视图中被处理。演示效果看[这里](/src/demos/hello5.html)。

Backbone.sync：使用匿名函数重载持久化存储。这个属性允许在不抛出异常信息的前提下使用 Model.destroy()。

ItemViews 对于每个条目响应两个点击动作，交换与删除。

initialize() 绑定模型更改与删除到适当的事件。

render() 包含两个额外的span以响应交换与删除事件。

unrender()：让模型从DOM中移除它自己。

swap() 会在内部交换条目的属性，当.set()模型函数被调用，事务更新将会被触发。

remove()：我们使用destroy()方法从集合中移除模型。通常这也会从持久存储中删除记录，但是我们重载了它（参考以上例子）。

	(function($){

	  Backbone.sync = function(method, model, success, error){
	    success();
	  }
	  var Item = Backbone.Model.extend({
	    defaults: {
	      part1: 'hello',
	      part2: 'world'
	    }
	  });

	  var List = Backbone.Collection.extend({
	    model: Item
	  });

	  var ItemView = Backbone.View.extend({
	    tagName: 'li', // name of tag to be created

	    events: {
	      'click span.swap':  'swap',
	      'click span.delete': 'remove'
	    },

	    initialize: function(){
	      _.bindAll(this, 'render', 'unrender', 'swap', 'remove'); // every function that uses 'this' as the current object should be in here

	      this.model.bind('change', this.render);
	      this.model.bind('remove', this.unrender);
	    },

	    render: function(){
	      $(this.el).html('<span style="color:black;">'+this.model.get('part1')+' '+this.model.get('part2')+'</span> &nbsp; &nbsp; <span class="swap" style="color:blue;">[swap]</span> <span class="delete" style="color:red;">[delete]</span>');
	      return this; // for chainable calls, like .render().el
	    },

	    unrender: function(){
	      $(this.el).remove();
	    },

	    swap: function(){
	      var swapped = {
	        part1: this.model.get('part2'),
	        part2: this.model.get('part1')
	      };
	      this.model.set(swapped);
	    },

	    remove: function(){
	      this.model.destroy();
	    }
	  });

	  var ListView = Backbone.View.extend({
	    el: $('body'), // el attaches to existing element
	    events: {
	      'click button#add': 'addItem'
	    },
	    initialize: function(){
	      _.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object should be in here

	      this.collection = new List();
	      this.collection.bind('add', this.appendItem); // collection event binder

	      this.counter = 0;
	      this.render();
	    },
	    render: function(){
	      var self = this;
	      $(this.el).append("<button id='add'>Add list item</button>");
	      $(this.el).append("<ul></ul>");
	      _(this.collection.models).each(function(item){ // in case collection is not empty
	        self.appendItem(item);
	      }, this);
	    },
	    addItem: function(){
	      this.counter++;
	      var item = new Item();
	      item.set({
	        part2: item.get('part2') + this.counter // modify item defaults
	      });
	      this.collection.add(item);
	    },
	    appendItem: function(item){
	      var itemView = new ItemView({
	        model: item
	      });
	      $('ul', this.el).append(itemView.render().el);
	    }
	  });

	  var listView = new ListView();
	})(jQuery);