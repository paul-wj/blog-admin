## koa2 + mysql + ioredis + koa2-cors

> 个人博客的后台api系统

- 前后台分离式开发（当前为后台仓库）。

* 我的博客地址: [汪小二的博客](https://www.wangjie818.wang/)

[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)&nbsp;&nbsp;[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)

### 实现功能

- [x] RESTful api 实现
- [x] 登录信息2小时过期（2小时内无任何操作）

### 技术栈
- 后端

  - koa2 + mysql
  - `joi dayjs koa2-cors koa-helmet`

## 博客预览
### pc 端管理系统页面

![](https://user-gold-cdn.xitu.io/2019/10/28/16e1140fab4cba72?imageView2/2/w/480/h/480/q/85/interlace/1)

## 项目结构

### 目录结构
```js
.
│
├─config                // 项目配置
├─init                  // 初始化数据库表结构
├─static                // 后台静态文件目录
└─src
   ├─controller         // 业务代码
   ├─routers         	  // 路由目录
   ├─schemas            // 校验目录
   ├─sql                // sql语句目录
   ├─utils              // 工具函数目录
   └─
```

## 使用这个项目
```bash
git https://github.com/wj5576081/blog-amdin.git

## 安装依赖以及开启开发模式
cd blog-amdin
pm2 start index.js

```
PS : 觉得不错的伙伴可以给个 star ~~~ 或者 fork 下来看看哦。如果有什么建议，也可以提 issue 哦
