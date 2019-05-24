CREATE TABLE  IF NOT EXISTS `article_reply` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
  `commentId` int(11) NULL DEFAULT NULL COMMENT '文章评论id',
  `userId` int(11) NULL DEFAULT NULL COMMENT '评论用户id',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '回复用户id',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '回复内容',
  `type` int(11) NULL DEFAULT NULL COMMENT '回复类型（10：点赞，20：踩,  30: 文字回复）',
  `createTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
