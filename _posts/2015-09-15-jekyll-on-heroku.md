---
layout: default
title: 在heroku上建立jekyll静态网站
tags: [jekyll,heroku]
---


[heroku](https://www.heroku.com) 是一个非常受欢迎的站点托管服务商，而且提供比较稳定的免费服务。jekyll是一个使用广泛的静态站点管理工具，且github上的静态页面就是用的jekyll来发布的。其实直接在github上建静态站点也是一个不错的主意，现实情况是github经常被墙。这是一个灰常的国度！

好了，说说正事。我也是看到国外的[一篇文章](http://www.jamesward.com/2014/09/24/jekyll-on-heroku),自己照着做居然真的做成了。

[狠狠点击这里查看](http://yuge.herokuapp.com/)

为了怕以后忘记，备份一下。

1. 在jekyll项目根目录下建立Gemfile文件

        source 'https://rubygems.org'
        ruby '2.1.2'
        gem 'jekyll'
        gem 'kramdown'
        gem 'rack-jekyll'
        gem 'rake'
        gem 'puma'

2. 运行：bundler install

3. 用Puma在服务器上启动站点，必须新建Procfile文件

    web: bundle exec puma -t 8:32 -w 3 -p $PORT

4. 新建Rakefile文件，ruby看不懂。

        namespace :assets do
          task :precompile do
            puts `bundle exec jekyll build`
          end
        end

5. 新建_config.yml 文件

        # Build settings
        markdown: kramdown
        permalink: pretty
        gems: ['kramdown']
        exclude: ['config.ru', 'Gemfile', 'Gemfile.lock', 'vendor', 'Procfile', 'Rakefile']

6. 新建config.ru 文件

        require 'rack/jekyll'
        require 'yaml'
        run Rack::Jekyll.new

大功告成，然后把站点push到heroku上就可以进行发布了。如果你是空白站点或者只是试试看效果，可以直接down[作者的代码](https://github.com/jamesward/jekyll-heroku)下来。

代码下下来你可以直接在本地运行。

    jekyll serve --watch

注：我本地运行有报错，发现是没有装python。主要是Pygments的安装依赖Python。安装好运行

    gem install pygments.rb --version "=0.5.0"

OK，本地也可以正常预览了。

> warning: cannot close fd before spawn 'which' 不是内部或外部命令，也不是可运行的程序或批处理文件。