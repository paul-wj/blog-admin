CREATE TABLE  IF NOT EXISTS `message_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `messageId` int(11) DEFAULT NULL COMMENT '信息id',
  `status` int(11) NULL DEFAULT 10 COMMENT '（10：已阅读）',
  `createDate` varchar(50) DEFAULT NULL COMMENT '阅读日期',
   PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;
