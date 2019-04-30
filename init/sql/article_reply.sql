CREATE TABLE  IF NOT EXISTS `article_reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commentId` int(11) DEFAULT NULL COMMENT '评论Id',
  `userId` int(11) DEFAULT NULL COMMENT '回复人',
  `toUserId` int(11) DEFAULT NULL COMMENT '回复对象',
  `content` longtext DEFAULT NULL COMMENT '回复内容',
  `createTime` varchar(20) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
