CREATE TABLE  IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sendId` int(11) DEFAULT NULL,
  `recId` int(11) DEFAULT NULL,
  `messageId` int(11) DEFAULT NULL,
  `createDate` varchar(50) DEFAULT NULL,
   PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;
