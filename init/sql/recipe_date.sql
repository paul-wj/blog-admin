create TABLE  IF NOT EXISTS `recipe_date` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipeDate` varchar(50) DEFAULT NULL COMMENT '菜单时间',
  `recipes` varchar(255) DEFAULT NULL COMMENT '菜单列表',
  `createTime`timestamp not null default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
