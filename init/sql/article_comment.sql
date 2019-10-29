CREATE TABLE  IF NOT EXISTS `article_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` int(11) DEFAULT NULL COMMENT '文章Id',
  `userId` int(11) DEFAULT NULL COMMENT '评论人',
  `content` longtext DEFAULT NULL COMMENT '评论内容',
  `createTime` varchar(50) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
