CREATE TABLE  IF NOT EXISTS `article_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '文章标题',
  `categories` varchar(255) DEFAULT NULL COMMENT '文章目录',
  `tagIds` varchar(255) DEFAULT NULL COMMENT '文章标签',
  `userId` int(11) DEFAULT 1 COMMENT '创建人id',
  `viewCount` int(11) DEFAULT 0 COMMENT '文章阅读数',
  `createTime` varchar(50) DEFAULT NULL COMMENT '创建时间',
  `updateTime` varchar(50) DEFAULT NULL COMMENT '更新时间',
  `content` longtext DEFAULT NULL COMMENT '文章内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
