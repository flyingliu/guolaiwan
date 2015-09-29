---
layout: default
title: Backbone中的View
tags: [backbone]
---



[本页demo](/src/demos/view.html)

View是backbone中重要的一环。第一个程序注定是从hello world开始。在开始之前，先创建一个HTML文件，在其中引用这三个JS库（注意：underscore要在backbone前面）：

	jquery.js
	underscore.js
	backbone.js

页面的内容就随意了，下面的例子要求页面中包含一个<div id="body" />节点。
然后创建一个最简单的View：

	var TestView = Backbone.View.extend({  //  创建一个view，其实就是一个HTML的DOM节点
	    initialize: function() {
	        this.render();
	    },
	    render: function() {  // 渲染方法
	        this.$el.html('Hello World');  //  this.el就是HTML节点，通过jQuery的html方法填充内容
	        return this;
	    }
	});

	$(function () {
	    var v = new TestView({el: $('#body')});  //  以目标节点（一个 <div id="body" />）为el参数，创建一个view的实例，render函数将会被自动调用并将渲染结果填充到el中
	    //v.render(); // 如果没在 initialize 里调用 render 的话，就需要在这里调用一次
	});

# 事件响应

试一个简单的效果：点击隐藏。把上面的View改成这样：

    var TestView = Backbone.View.extend({
        events: {
            'click button#toggle' : 'toggle' //  响应toggle button的click事件
        },
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html('<p id="hello">Hello World</p><button id="toggle">Toggle</button>');  //  增加一个toggle button
            return this;
        },
        toggle: function() {
            $("#hello").toggle();  //  用jQuery的toggle方法切换显示
            return this;
        }
    });

注意，如果 events 里用的是非唯一的绑定，可以通过以下方式取得发生事件的对象：
	// ...
	'click button.show': 'showItem'
	// ...
	showItem: function (e) {
	  alert($(e.currentTarget));
	}

# 模板

代码里嵌入HTML是很麻烦的事情，所以模板是需要的。理论上可以在backbone里使用任何JavaScript模板，这里以underscore自带的template为例。先按模板的语法在HTML文件里写一个模板：

    <script type="text/template" id="hello-template">
        <div>
            <h3 id="hello">${message}</h3>
            <button id="toggle">Toggle</button>
        </div>
    </script>

为了不影响页面的正常显示，JS模板通常都是放在 text/template 类型的 script 标签里。
注意，因为习惯的问题，模板里的变量标记没有使用默认的<%= %>，而是改成和python mako里一样的 ${ }，为此需要修改underscore的模板设置如下：

	_.templateSettings = {
	   interpolate : /\$\{(.+?)\}/g
	};

而显示模板的方法如下：

	var TestView = Backbone.View.extend({
        template: null,  //  把模板直接放这里有时也可以，但有时又会出错，还不知道是什么原因
        events: {
            'click button#toggle' : 'toggle'
        },
        initialize: function() {
            this.template = _.template($("#hello-template").html());  //  模板放这里一般没问题
            this.render();
        },
        render: function() {
            this.$el.html(this.template({message: "hello world!"}));  //  渲染模板
            return this;
        },
        toggle: function() {
            this.$("#hello").toggle();
            return this;
        }
    });
