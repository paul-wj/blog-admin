CREATE TABLE  IF NOT EXISTS `user_reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `replyType` int(11) NULL DEFAULT NULL COMMENT '回复类型（10: 回复他人评论， 20：回复别人的回复）',
  `commentId` int(11) NULL DEFAULT NULL COMMENT '用户评论id',
  `replyId` int(11) NULL DEFAULT NULL COMMENT '回复目标id（replyType为10时为commentId，replyWay为20时为replyId）',
  `userId` int(11) NULL DEFAULT NULL COMMENT '评论用户id',
  `sendId` int(11) NULL DEFAULT NULL COMMENT '发送目标id',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '回复内容',
  `type` int(11) NULL DEFAULT 30 COMMENT '回复类型（10：点赞，20：踩,  30: 文字回复）',
   `createTime` varchar(50) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
