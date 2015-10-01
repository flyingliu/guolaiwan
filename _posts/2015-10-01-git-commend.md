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

    git remote add origin git@github.com:flyingliu/gittest.git
    git push -u origin master

注意点：为什么push时加 `-u` 参数

简单来说使用git push -u origin master以后就可以直接使用不带别的参数的git pull从之前push到的分支来pull。