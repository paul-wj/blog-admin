CREATE TABLE  IF NOT EXISTS `message_content` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NULL DEFAULT NULL COMMENT '10: 文章评论 20：文章评论回复',
  `title` varchar(255) DEFAULT NULL COMMENT '评论主题',
  `sourceId` int(11) NULL DEFAULT NULL COMMENT '原始id',
  `content` longtext DEFAULT NULL,
  `createDate` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
