CREATE TABLE  IF NOT EXISTS `log_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `host` varchar(50) DEFAULT NULL,
  `origin` varchar(50) DEFAULT NULL,
  `userAgent` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `url` varchar(50) DEFAULT NULL,
  `method` varChar(20)  DEFAULT NULL,
  `createTime` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
