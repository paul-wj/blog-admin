const {query} = require('../utils/async-db');
const USER_TABLE_NAME = 'article_info';
const article = {
	async getArticleAllList() {
		return query(`select * from ${USER_TABLE_NAME}`)
	}
};
module.exports = article;
