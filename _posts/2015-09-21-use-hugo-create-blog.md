---
layout: default
title: 使用hugo搭建个人博客
tags: [pattern,regular]
---



截至目前我写这篇博客，用的是jekyll。jekyll文档很多，虽然配置稍微有点麻烦，但对于折腾过nodejs的前端来说，勉强可以应付。目前来说我觉得jekyll还是很完美的。当然这是在我博文比较少的情况，我也在担忧如果哪天我的博文躲起来是不是编译就要花费不少时间。文件多了也不好管理。jekyll应该有个归档功能，把发布的文章能分类处理，不需要每次都重新编译所有文章。当然最好的把速度提上去，那所有的问题都不是问题了。

最近接触的静态服务器来搭建博客的工具挺多。用过一阵子harpjs，对于本地我做静态站点确实很好用，集成了如jade,sass,coffeescript等编译工具。不需要配置文件，这些统统搞定，对于定制要求不高的话，确实是一个不二选择。我还在heroku上试着搭建了几个小站点，不用本地编译导出就能用，感觉很方便。但是对于经常写文字，敲代码还是有点不太方便。

未雨绸缪，我决定还是用用hugo这个由go语言搭建的工具。据说唯一的缺点就是太快了，太快了，太快了。重要的事情要说三遍的。说说步骤：

Hugo官方主页：[https://gohugo.io/](https://gohugo.io/)

一. [下载hugo](https://github.com/spf13/hugo/releases),支持多个系统平台，只是下载地址好像在amazonaws.com上，有被墙了。国内的局域网挺操蛋的。

二. 解压文件，都不用安装，设置下系统路径就OK了。在cmd中设置路径运行：

    hugo new site /path/site

三. 进入site目录就可以看到如下目录结构了。
    archetypes/
    content/
    layouts/
    static/
    config.toml

简要介绍一下，config.toml是网站的配置文件，这是一个TOML文件，全称是Tom’s Obvious, Minimal Language，这是它的作者GitHub联合创始人Tom Preston-Werner 觉得YAML不够优雅，捣鼓出来的一个新格式。如果你不喜欢这种格式，你可以将config.toml替换为YAML格式的config.yaml，或者json格式的config.json。hugo都支持。

content目录里放的是你写的markdown文章，layouts目录里放的是网站的模板文件，static目录里放的是一些图片、css、js等资源。

创建一个页面：

    hugo new about.md

如果是博客日志，最好将md文件放在content的post目录里。

    hugo new post/first.md

编辑刚才新建的页面：

    +++
    date = "2015-01-08T08:36:54-07:00"
    draft = true
    title = "first"
    +++

    ### Hello Hugo

OK，刚才的about.md也有内容，该看看最后的效果了。然后你屁颠屁颠的使用hugo server启动，打开浏览器里一看，发现毛都没有！这是肿么了！

这是Hugo对初学者非常不友好的地方，默认生成的网站是没有任何皮肤模板的。为了看看第一个写的示例，还得去Github上把一个网页模板下载下来。如果你网络够好，网速够快，你可以在刚才的目录将Hugo官方的所有模板都下载下来：

    git clone --recursive https://github.com/spf13/hugoThemes themes

我尝试过，也失败过，且从未成功一次性将所有的模板下载下来。所以，我们还是老老实实只下载其中一个模板来看看效果吧：

    cd themes
    git clone https://github.com/spf13/hyde.git

启动本地调试：

    hugo server --theme=hyde --buildDrafts --watch

OK,大功告成了，现在可以启用浏览器查看了。

–watch或者-w 选项打开的话，将会监控到文章的改动从而自动去刷新浏览器，不需要自己手工去刷新浏览器，非常方便。

如果你看了上面的说明已经有冲动去试一试Hugo了，我的目的也算达到了，接下来你需要的只是查看官方的说明文档就够了，所以具体的一些设置我就不重复了。

官方文档：[https://gohugo.io/overview/introduction/](https://gohugo.io/overview/introduction/)

皮肤列表：[https://github.com/spf13/hugoThemes](https://github.com/spf13/hugoThemes)

常用文档：

-  [Configuring Hugo](https://gohugo.io/overview/configuration/)
-  [Front Matter](https://gohugo.io/content/front-matter/)
-  [Menus](https://gohugo.io/extras/menus/)
-  [Template Variables](https://gohugo.io/templates/variables/)
-  [Hosting on GitHub Pages](https://gohugo.io/tutorials/github-pages-blog/)

# Hugo发布时要注意的地方

1. 生产环境和开发环境的区别，server命令不加参数`baseUrl`时输出的链接全是localhost:1313的绝对地址，所以push前需要删除public文件夹，然后`hugo -t themeName`就行了；如果配置文件制定了theme,那么直觉 `hugo` 命令就行了。

2. front-matter内容中url的值最好符合Jekyll的格式，这与config.toml中的permalinks相关联，详细设置在 [http://gohugo.io/content/organization/](http://gohugo.io/content/organization/)

3. post的md文件编码必须是utf-8的，要不乱码

分享个cmd文件`hugo-n`用于快速新建一篇博文()

    ```
    rem 用法：`hugo-n a-post-title-without-ext-md`
    @echo off
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (set mydate=%%a-%%b-%%c)
    set postname=post\%mydate%-%1.md
    if exist content\%postname% (
    echo 文件已存在，按任意键退出 & pause>nul & exit ) else (
    hugo new %postname%
    gvim content\%postname% )
    ```
