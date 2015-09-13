---
layout: default
title: 点击事件绑定Demo
tags: [demo]
---

# {{page.title}}

<div class="action1"> 这是一个 .action1 的类，我上面有一个点击事件:action1 </div>
<div class="act"> 这是一个 .act 的类，我上面有一个点击事件:act</div>
<div class="else do doing"> 这是一个 .do 和 .doing 的类，我上面有点击事件:do和doing</div>

<div class="myhide" style="display:none;">这是一个隐藏的div,我有一个样式：myhide,最后由下面按钮显示</div>

<a class="btn btn-primary">显示隐藏</a>


<div id="myid">这是一个没有事件的div</div>

代码如下：

    var addEvent = {
      "action1": function() {
        console.log('action1');
      },
      "act":function() {
        console.log('act');
        alert('act');
      },
      "do":function() {
        console.log('do');
      },
      "doing":function() {
        console.log('doing');
      },
      "btn-primary":function(){
        console.log("btn-primary");
        $('.myhide').show();
      },
      "myhide":function(){
        console.log('我是隐藏后再显示的内容哦！');
      }
    }

    $(function(){
      $("body").on('click','[class]',function(e){
        for(var cn in addEvent){
          if($(this).hasClass(cn)) {
            addEvent[cn]();
          }
        }
        return false;
      })
    })


<script>
var addEvent = {
  "action1": function() {
    console.log('action1');
  },
  "act":function() {
    console.log('act');
    alert('act');
  },
  "do":function() {
    console.log('do');
  },
  "doing":function() {
    console.log('doing');
  },
  "btn-primary":function(){
    console.log("btn-primary");
    $('.myhide').show();
  },
  "myhide":function(){
    console.log('我是隐藏后再显示的内容哦！');
  }
}

$(function(){
  $("body").on('click','[class]',function(e){
    for(var cn in addEvent){
      if($(this).hasClass(cn)) {
        addEvent[cn]();
      }
    }
  })

})

</script>