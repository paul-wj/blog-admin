create TABLE  IF NOT EXISTS `recipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '菜名称',
  `createTime` timestamp not null default CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` varchar(20) DEFAULT NULL COMMENT '更新时间',
  `description` longtext DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
