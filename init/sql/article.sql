CREATE TABLE  IF NOT EXISTS `article_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `updateTime` varchar(20) DEFAULT NULL,
  `createTime` varchar(20) DEFAULT NULL,
  `tagIds` varchar(255) DEFAULT NULL,
  `categories` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
