CREATE TABLE  IF NOT EXISTS `performance_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipmentId` int(11) NOT NULL COMMENT '设备id',
  `name` longtext DEFAULT NULL COMMENT '文件名',
  `encodedBodySize` int(11) DEFAULT NULL COMMENT '压缩之后body大小',
  `decodedBodySize` int(11) DEFAULT NULL COMMENT '解压之后body大小',
  `timeout` int(11) DEFAULT NULL COMMENT '超时时间阀值',
  `duration` decimal(8,2) DEFAULT NULL COMMENT '请求总时间',
  `protocol` varchar(50) DEFAULT NULL COMMENT '请求资源的网络协议',
  `type` varchar(50) DEFAULT NULL COMMENT '发起资源的类型',
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
