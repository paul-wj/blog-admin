CREATE TABLE  IF NOT EXISTS `page_error_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `equipmentId` int(11) DEFAULT NULL COMMENT '设备id',
  `href` varchar(255) DEFAULT NULL COMMENT '资源引入报错页面地址',
  `src` varchar(255) DEFAULT NULL COMMENT '报错文件地址',
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
