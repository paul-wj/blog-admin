CREATE TABLE  IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sendId` int(11) DEFAULT NULL COMMENT '发送人id',
  `recId` int(11) DEFAULT NULL COMMENT '接收人id',
  `messageId` int(11) DEFAULT NULL COMMENT 'message内容id',
  `createDate` varchar(50) DEFAULT NULL COMMENT '发送日期',
   PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;
