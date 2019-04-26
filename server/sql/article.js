const {html_encode} = require('../utils');
const {query} = require('../utils/async-db');
const ARTICLE_TABLE_NAME = 'article_info';
const article = {
	async getArticleAllList() {
		return query(`select * from ${ARTICLE_TABLE_NAME}`)
	},
	async getArticleById(id) {
		return query(`select * from ${ARTICLE_TABLE_NAME} where id=${id}`)
	},
	async createArticle(data) {
		let sqlStatement = `insert into ${ARTICLE_TABLE_NAME} (title, categories, tagIds, content, updateTime, createTime) values (?, ?, ?, ?, ?, ?)`;
		let currentDate = new Date().toLocaleString();
		let content = html_encode(data.content);
		return query(sqlStatement, [data.title, data.categories, data.tagIds, content, currentDate, currentDate])
	},
	async editArticle(id, data) {
		let currentDate = new Date().toLocaleString();
		let content = html_encode(data.content);
		return query(`update ${ARTICLE_TABLE_NAME} set title='${data.title}', categories='${data.categories}', tagIds='${data.tagIds}', content='${content}', updateTime='${currentDate}' where id = ${id}`)
	},
	async deleteArticle(id) {
		return query(`delete from ${ARTICLE_TABLE_NAME} where id = ${id}`)
	}
};
module.exports = article;
