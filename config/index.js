const r = require('path').resolve;

const IS_LOCAL = false;

const config = {
	IS_LOCAL,
	port: 9000,
	database: {
		DATABASE: 'own_blog',
		USERNAME: 'root',
		PASSWORD: IS_LOCAL ? 'www5576081' : 'ufrVTJd2ONn#U%t&',
		PORT: '3306',
		HOST: 'localhost',
	},
	redis: {
		host: 'localhost',
		port: '6379',
	},
	databaseNameList: {
		ARTICLE_TABLE_NAME: 'article_info',
		ARTICLE_COMMENT_TABLE_NAME: 'article_comment',
		ARTICLE_REPLY_TABLE_NAME: 'article_reply',
		USER_TABLE_NAME: 'user_info',
		LOGGER_TABLE_NAME: 'log_info',
		TAG_TABLE_NAME: 'tag_info',
		CATEGORY_TABLE_NAME: 'category_info',
		RECIPE_TABLE_NAME: 'recipe',
		RECIPE_DATE_TABLE_NAME: 'recipe_date',
		MESSAGE: 'message',
		MESSAGE_CONTENT: 'message_content',
		MESSAGE_USER: 'message_user',
		ABOUT_COMMENT_TABLE_NAME: 'about_comment',
		ABOUT_REPLY_TABLE_NAME: 'about_reply',
	},
	BASE_PATH: r(__dirname, '../'),
	STATIC_PATH: r(__dirname, '../static'),
	PRIVATE_KEY: r(__dirname, '../private.key'),
	PUBLIC_KEY: r(__dirname, '../public.key')
};
module.exports = config;
