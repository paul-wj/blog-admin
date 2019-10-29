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
