CREATE TABLE  IF NOT EXISTS `message_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `messageId` int(11) DEFAULT NULL,
  `status` int(11) NULL DEFAULT 10 COMMENT '（10：已阅读）',
  `createDate` varchar(50) DEFAULT NULL,
   PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;
