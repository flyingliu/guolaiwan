---
layout: default
title: 趣谈 JavaScript 中的 ASI (Automatic Semicolon Insertion)
tags: [javascript]
---

# {{page.title}}

自动分号插入 (automatic semicolon insertion, ASI) 是一种程序解析技术，它在 JavaScript 程序的语法分析 (parsing) 阶段起作用。

根据 ES2015 规范，某些（不是全部） JavaScript 语句需要用 ; 来表示语句的结束；然而为了方便书写，在某些情况下这些分号是可以从源码中省略的，此时我们称 ; 被 parser 自动插入到符号流 (token stream) 中，这种机制称为 ASI。

所谓的“自动分号插入”其实只是一种形象的描述，parser 并没有真的插入一个个分号。ASI 只是表示编译器正确理解了程序员的意图。听起来就像编译器对程序员说：“Hey，哥们！虽然这里你没写分号，但我知道你想说这条语句已经结束了。”

需要用 ; 来表示结束的语句是：

- 空语句
- 以 let 、 const 、import 、 export 开头的声明语句
- 以 var 开头的变量声明语句
- 表达式语句
- debugger 语句
- continue 语句
- break 语句
- return 语句
- throw 语句

并不是所有的 JavaScript 语句都需要用 ; 表示结束，例如：

- 块语句
- if 语句
- try 语句
- 这些语句本来就不需要 ; 表示结束。

举例来说，函数声明 (Function declaration, FD) 不需要以分号结束：

    function add10(num) {
        return num + 10;
    } // I don't need a semicolon here

如果你画蛇添足地在 FD 之后写了一个 ;，它会被解析为一条空语句。

ASI 规则

ASI 是备胎（第二选择）

编译器不会优先启用 ASI 机制。实际上，在遇到行结束符 (Line Terminator) 时，编译器总是先试图将行结束符分隔的符号流当作一条语句来解析（其实有少数几个特例：return、throw、break、continue、yield 、++ 、 --，随后会介绍），实在不符合正确语法的情况下，才会退而求其次，启用 ASI 机制，将行结束符分隔的符号流当作两条语句（俗称，插入分号）。来看下面的例子：

    var a = 0
    var b = 1

这个简单代码段的符号流为：

    var   a   =   0   \n   var   b   =   1

parser 从左至右解析这个符号流，解析过程中它遇到了换行符 LF ( \n , 行结束符之一)。它看起来这样自言自语：“我遇到了一个换行符，让我先试试去掉它，把这个代码段当作一条语句试试！”

于是 parser 实际上先解析了这样一条语句：

    var a = 0 var b = 1
    // Uncaught SyntaxError: Unexpected token var

很显然这是一条有语法错误的语句，此路不通！

parser 说：“这个符号流如果当作一条语句的话，是有语法错误的！这该怎么办呢？我是不是要就此放弃、直接抛出语法错误呢？不！我可是要成为海贼王的男人！我要启用 ASI 机制试试。”

于是不折不挠的 parser 又解析了下面的语句：

    var a = 0; var b = 1     // legal syntax

Bingo! 没有 SyntaxError ，解析通过！

parser 于是得意地对程序员说：“Hey，哥们！虽然在 \n 前面你没写分号，但我知道你想说 var a = 0 这条赋值语句已经结束了！”

“高！实在是高！”

脆弱的符号、被误解的源码

需要注意的是，parser 对符号流的这种处理机制有时会导致它误解程序员的意图。

    var a = [1, [2, 3]]
    [3, 2, 1].map(function(num) {
        return num * num;
})
由于 parser 总是优先将换行符前后的符号流当作一条语句解析，parser 实际上先解析了下面的语句：

    var a = [1, [2, 3]][3, 2, 1].map(function(num) {
        return num * num;
    })

这是一条语法正确的语句。它的含义是：先声明变量a ，对 [1, [2, 3]][3, 2, 1] 求值之后得到数组 [2, 3] ，对 [2, 3] 进行 (num) => num * num 映射操作得到 [4, 9]，将数组 [4, 9] 赋给变量 a 。

以 ( 开始的语句，比如 IIFE ，也会导致程序被 parser 误解。

    (function fn() {
        return fn;
    })()
    (function() {
        console.log('我会显示在控制台吗？');
    })()
它等价于

// 一条函数连续调用语句
(function fn() {
    return fn;
})()(function() {
    console.log('我会显示在控制台吗？');
})()  // => fn
以 / 开始的语句，通常是正则表达式放在语句起始处（这种情况比较少见），也会导致程序被 parser 误解。

var a = 2
/error/i.test('error')
它等价于

var a = 2 / error / i.test('error')
// => Uncaught ReferenceError: error is not defined
需要注意的是，虽然 var a = 2 / error / i.test('error') 会抛出 ReferenceError 异常，但它是一条没有语法错误 (SyntaxError) 的语句。换句话说，该语句在 parser 眼里是一条语法正确的语句，因此 parser 不会启用 ASI 机制。

语句起始处的 + 和 - 也会导致源码被误解（更加少见）。

var num = 5
+new Date - new Date(2009, 10)
等价于

var num = 5 + new Date - new Date(2009, 10)

源码的意图被 parser 误解，有两个必要条件：

parser 优先将行结束符前后的符号流按一条语句解析，这是 ECMAScript 标准的规定，所有 parser 必须要按此要求实现。
行结束符之后的符号 (token) 有二义性，使得该符号与上条语句能够无缝对接，不导致语法错误。
实际上，有二义性的符号本来就不多，能导致源码意图被改变的符号数来数去就只有 [ 、( 、/ 、+ 、- 这五个而已。我们可以把它们理解成“脆弱的符号”，在它们前面显式地加上防御性分号 (defensive semicolon) 来保护其含义不被改变。

限制产生式——备胎转正

前文说到，ASI 是一种备用选择。然而在 ECMAScript 中，有几种特殊语句是不允许行结束符存在的。如果语句中有行结束符，parser 会优先认为行结束符表示的是语句的结束，这在 ECMAScript 标准中称为限制产生式 (restricted production)。

通俗地说，在限制产生式中，parser 优先启用 ASI 机制。

一个典型限制产生式的例子是 return 语句。

    function a() {
        return
        {};
    }
    a()   // => undefined

按照一般解析规则，如果 ASI 是第二选择，那么 parser 优先忽略 \n ，该代码段应与下面的程序无异：

    function a() {
        return {};
    }
    a()  // => {} (empty object)

然而事实并非如此，因为 ECMAScript 标准对合法的 return 语句做了如下限制：

ReturnStatement:
return [no LineTerminator here] Expression ;
return 语句中是不允许在 return 关键字之后出现行结束符的，所以上面的代码段其实等价于：

    function a() {
        return;    // ReturnStatement
        {}         // BlockStatement
        ;          // EmptyStatement
    }
    a()  // => undefined

函数体内的代码被解析为 return 语句、块语句、空语句三条单独的语句。

标准规定的其它限制产生式有：

+ continue 语句
+ break 语句
+ throw 语句
+ 箭头函数 （箭头左侧不允许有行结束符）
+ yield 表达式
+ 后自增/自减表达式
+ 这些情况都不允许有换行符存在。

    a
    ++
    b

被解析为

    a;
    ++b;

ES2015 标准给出了关于限制产生式的编程建议：

> A postfix ++ or -- operator should appear on the same line as its operand. （后自增运算符或后自减运算符应与它的操作数处于同一行。）
  An Expression in a return or throw statement or an AssignmentExpression in a yield expression should start on the same line as the return, throw, or yield token. （return 或 throw 语句中的表达式以及 yield 表达式中的赋值表达式应与 return 、throw 、yield 这些关键字处于同一行。）
An IdentifierReference in a break or continue statement should be on the same line as the break or continue token. （break 或 continue 语句中的标签名应与 break 或 continue 关键字处于同一行。）
言而总之，总而言之，ES2015 标准这一节就告诉你一件事：在限制生产式中别换行，换行就自动插入分号。

for 循环与空语句——永不使用的备胎

ASI 不适用于 for 循环头部，即 parser 不会在这里自动插入分号。

    var a = ['once', 'a', 'rebound,', 'always', 'a', 'rebound.']
    var msg = ''
    for (var i = 0, len = a.length
        i < len
        i++) {
        msg += a[i] + ' '
    }
    console.log(msg)

好吧，也许你希望 parser 在 a.length 后面和 i < len 后面自动为你插入分号，补全这个 for 循环语句，但是 parser 不会在 for 循环的头部启用 ASI 机制。parser 首先尝试按一条语句解析

(var i = 0, len = a.length \n i < len \n i++)
这个符号流，发现它并非一条合法语句后，就直接抛出了语法错误 Uncaught SyntaxError: Unexpected Identifier，根本不尝试补全分号。

所以 for 循环头部的分号必须要显式地写出：

    var a = ['once', 'a', 'rebound,', 'always', 'a', 'rebound.']
    var msg = ''
    for (var i = 0, len = a.length;
    i < len;
    i++) {
    msg += a[i] + ' '
    }
    console.log(msg)
    // => 'once a rebound, always a rebound.' （一朝为备胎，永久为备胎）

类似地，有特殊含义的空语句也不可以省略分号：

    function infiniteLoop() {
        while('a rebound is a rebound is a rebound')
    }

此段代码是不合法的语句，parser 会抛出语法错误 Uncaught SyntaxError: Unexpected token } 。这是因为循环体中作为空语句而存在的 ; 不能省略。

    // legal syntax
    function infiniteLoop() {
        while('a rebound is a rebound is a rebound');
    }
    // it is true that a rebound is a rebound is a rebound （备胎就是备胎，这是真理。）

总结

ASI 机制的存在为 JavaScript 程序员提供了一种选择：你可以省略源码中的绝大部分 ; 而不影响程序的正确解析。与 IT 业界的 “Vim 和 Emacs 哪个是更好的编辑器” 一样，JavaScript 社区隔一段时间就会出现“该不该写分号”这样的观点之争。本文并不是想证明哪种观点更好，而是关注 ASI 机制本身的一些有趣事实。即便是坚定的无分号党，也不得不承认，有些分号是不能省略的。这些不能省略的分号有：

- for 循环头部的分号
- 作为空语句存在的分号
- 以 5 个“脆弱符号”开头的语句之前的分号 （严格来讲，此处的分号不是必须的；因为除了使用分号，还可以用各种 hack 方法，比如 void）

而对于坚定的分号党，有一个事实也不得不承认，那就是你的程序中很可能有 99% 的分号都是多余的！如果你想尝试一下不写分号，可以按照下面的步骤：

- 删掉你所有语句结尾处的分号
- 如果你的语句开头是 [ 或 (，在它前面加一个分号。Over!