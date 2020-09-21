CREATE TABLE  IF NOT EXISTS `performance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipmentId` int(11) NOT NULL COMMENT '设备id',
  `intervalId` int(11) NOT NULL COMMENT '区间id',
  `fpt` decimal(8,2) DEFAULT NULL COMMENT '白屏时间',
  `tti` decimal(8,2) DEFAULT NULL COMMENT '首次可交互时间',
  `ready` decimal(8,2) DEFAULT NULL COMMENT 'HTML加载完成时间',
  `loadTime` decimal(8,2) DEFAULT NULL COMMENT '页面完全加载时间',
  `firstbyte` decimal(8,2) DEFAULT NULL COMMENT '首包时间',
  `compressionRatio` decimal(8,2) DEFAULT NULL COMMENT '压缩比例',
  `type` varchar(50) DEFAULT NULL COMMENT '页面打开方式',
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
