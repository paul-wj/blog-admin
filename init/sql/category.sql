CREATE TABLE  IF NOT EXISTS `category_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT 1,
  `updateTime` varchar(50) DEFAULT NULL,
  `createTime` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
