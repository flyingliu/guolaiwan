---
layout: default
title: git命令行
tags: [git]
---


git命令用得不是很熟，备份下。

1. 添加远程仓库地址

开始用命令行创建一个新的存储库


    echo # gittest >> README.md
    git init
    git add README.md
    git commit -m "first commit"
    git remote add origin git@github.com:flyingliu/gittest.git
    git push -u origin master


推送到现有的存储库
    // git subtree add --prefix=public git@github.com:flyingliu/gittest.git gh-pages --squash
    // git subtree pull --prefix=public git@github.com:flyingliu/gittest.git gh-pages
    // git subtree push --prefix=public git@github.com:flyingliu/gittest.git gh-pages
    // git submodule add git@github.com:flyingliu/flyingliu.github.io.git public
    // git submodule pull git@github.com:flyingliu/flyingliu.github.io.git public
    git remote add origin git@github.com:flyingliu/flyingliu.github.io.git
    git push -u origin master

注意点：为什么push时加 `-u` 参数

简单来说使用git push -u origin master以后就可以直接使用不带别的参数的git pull从之前push到的分支来pull。

-----

位到上一个提交前的状态 git reset --hard 同时删除提交

    git reset --hard HEAD^


----

# 给git命令起别名

我们可以在 ~/.gitconfig 文件里面进行别名设置，即加上下面这几行

    [alias]
      st = status
      ci = commit
      br = branch
      co = checkout
      df = diff

也可以用下面命令行添加

    git config --global alias.l   "log --color --graph --decorate --pretty=oneline --abbrev-commit"
    git config --global alias.l0  "log --color --graph --decorate --pretty=oneline --abbrev-commit -U0"
    git config --global alias.la  "log --color --graph --decorate --pretty=oneline --abbrev-commit --all"
    git config --global alias.lb  "log --color --graph --decorate --pretty=oneline --abbrev-commit --all --simplify-by-decoration"
    git config --global alias.lg  "log --color --graph --decorate"
    git config --global alias.dl  "log --date-order --color --graph --decorate --pretty=oneline --abbrev-commit"
    git config --global alias.dla  "log --date-order --color --graph --decorate --pretty=oneline --abbrev-commit --all"
    git config --global alias.dlb  "log --date-order --color --graph --decorate --pretty=oneline --abbrev-commit --all --simplify-by-decoration"
    git config --global alias.dlg  "log --date-order --color --graph --decorate"


    git config --global alias.d   "diff --color"
    git config --global alias.dc  "diff --color --cached"
    git config --global alias.d0  "diff --color --unified=0"
    git config --global alias.ci  "commit --verbose"
    git config --global alias.co  "checkout"
    git config --global alias.tr  "checkout --track"
    git config --global alias.s   "status --short"
    git config --global alias.st  "status"


-----

# 小贴士
1. git中分支名与文件名最好不要重名，以免引起不必要的麻烦

