CREATE TABLE  IF NOT EXISTS `page_error` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `equipmentId` int(11) DEFAULT NULL COMMENT '设备id',
  `href` varchar(255) DEFAULT NULL COMMENT '报错页面地址',
  `message` varchar(255) DEFAULT NULL COMMENT '错误描述',
  `url` varchar(255) DEFAULT NULL COMMENT '报错文件',
  `lineNum` int(11) DEFAULT NULL COMMENT '报错行号',
  `columnNum` int(11) DEFAULT NULL COMMENT '报错列号',
  `error` longtext DEFAULT NULL COMMENT '错误Error对象',
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
