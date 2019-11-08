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

## 表结构

### 文章表
```
CREATE TABLE  IF NOT EXISTS `article_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `categories` varchar(255) DEFAULT NULL,
  `tagIds` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT 1,
  `createTime` varchar(50) DEFAULT NULL,
  `updateTime` varchar(50) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
### 文章评论表
```
CREATE TABLE  IF NOT EXISTS `article_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` int(11) DEFAULT NULL COMMENT '文章Id',
  `userId` int(11) DEFAULT NULL COMMENT '评论人',
  `content` longtext DEFAULT NULL COMMENT '评论内容',
  `createTime` varchar(50) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
### 文章评论回复表
```
CREATE TABLE  IF NOT EXISTS `article_reply` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
  `commentId` int(11) NULL DEFAULT NULL COMMENT '文章评论id',
  `replyWay` int(11) NULL DEFAULT NULL COMMENT '回复方式（10: 回复他人评论， 20：回复别人的回复）',
  `replyId` int(11) NULL DEFAULT NULL COMMENT '回复目标id（replyWay为10时为commentId，replyWay为20时为replyId）',
  `userId` int(11) NULL DEFAULT NULL COMMENT '评论用户id',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '回复用户id',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '回复内容',
  `type` int(11) NULL DEFAULT NULL COMMENT '回复类型（10：点赞，20：踩,  30: 文字回复）',
  `createTime` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
### 目录表
```
CREATE TABLE  IF NOT EXISTS `category_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT 1,
  `updateTime` varchar(50) DEFAULT NULL,
  `createTime` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
### 标签
```
CREATE TABLE  IF NOT EXISTS `tag_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT 1,
  `color` varchar(20) DEFAULT NULL,
  `updateTime` varchar(50) DEFAULT NULL,
  `createTime` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
### 收发关系表
```
CREATE TABLE  IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sendId` int(11) DEFAULT NULL COMMENT '发送人id',
  `recId` int(11) DEFAULT NULL COMMENT '接收人id（recId为0时为全部用户）',
  `messageId` int(11) DEFAULT NULL COMMENT 'message内容id',
  `createDate` varchar(50) DEFAULT NULL COMMENT '发送日期',
   PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
### 发送消息表
```
CREATE TABLE  IF NOT EXISTS `message_content` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NULL DEFAULT NULL COMMENT '10: 文章评论 20：文章评论回复（业务可扩展）',
  `title` varchar(255) DEFAULT NULL COMMENT '评论主题',
  `sourceId` int(11) NULL DEFAULT NULL COMMENT '评论源id',
  `content` longtext DEFAULT NULL COMMENT '内容',
  `createDate` varchar(50) DEFAULT NULL COMMENT '发送日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
### 用户消息关系表
```
CREATE TABLE  IF NOT EXISTS `message_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `messageId` int(11) DEFAULT NULL COMMENT '信息id',
  `status` int(11) NULL DEFAULT 10 COMMENT '（10：已阅读）',
  `createDate` varchar(50) DEFAULT NULL COMMENT '阅读日期',
   PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## 使用这个项目
```bash
git https://github.com/wj5576081/blog-amdin.git

## 安装依赖以及开启开发模式
cd blog-amdin
pm2 start index.js

```
PS : 觉得不错的伙伴可以给个 star ~~~ 或者 fork 下来看看哦。如果有什么建议，也可以提 issue 哦
