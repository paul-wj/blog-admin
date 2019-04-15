CREATE TABLE  IF NOT EXISTS `article_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `update_time` varchar(20) DEFAULT NULL,
  `create_time` varchar(20) DEFAULT NULL,
  `tag_ids` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
