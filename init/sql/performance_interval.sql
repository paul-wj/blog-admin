CREATE TABLE  IF NOT EXISTS `performance_interval` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dns` decimal(8,2) DEFAULT NULL COMMENT 'DNS查询耗时',
  `tcp` decimal(8,2) DEFAULT NULL COMMENT 'TCP连接耗时',
  `ttfb` decimal(8,2) DEFAULT NULL COMMENT '请求响应耗时',
  `trans` decimal(8,2) DEFAULT NULL COMMENT '内容传输耗时',
  `dom` decimal(8,2) DEFAULT NULL COMMENT 'DOM解析耗时',
  `res` decimal(8,2) DEFAULT NULL COMMENT '资源加载耗时',
  `sslTime` decimal(8,2) DEFAULT NULL COMMENT 'SSL安全连接耗时',
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
