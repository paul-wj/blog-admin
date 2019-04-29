CREATE TABLE  IF NOT EXISTS `log_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `host` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `url` varchar(20) DEFAULT NULL,
  `method` varChar(20)  DEFAULT NULL,
  `createTime` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
