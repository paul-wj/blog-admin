const {html_encode} = require('../utils');
const {query} = require('../utils/async-db');
const ARTICLE_TABLE_NAME = 'article_info';
const ARTICLE_COMMENT_TABLE_NAME = 'article_comment';
const article = {
	async getArticleAllList() {
		return query(`select * from ${ARTICLE_TABLE_NAME}`)
		// return query(`SELECT a.*, b.id commentId, b.content commentContent, b.createTime commentCreateTime, c.username userName
		// FROM ${ARTICLE_TABLE_NAME} a LEFT JOIN ${ARTICLE_COMMENT_TABLE_NAME} b
		// ON a.id = b.articleId LEFT JOIN user_info c ON b.userId = c.id;`)
	},
	async getArticleById(id) {
		return query(`select * from ${ARTICLE_TABLE_NAME} where id=${id}`);
		// return query(`SELECT a.*, b.id commentId, b.content commentContent, b.createTime commentCreateTime, b.userId, c.username userName
		// FROM ${ARTICLE_TABLE_NAME} a LEFT JOIN ${ARTICLE_COMMENT_TABLE_NAME} b
		// ON a.id = b.articleId LEFT JOIN user_info c ON b.userId = c.id where a.id=${id};`)
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
		return query(`delete ${ARTICLE_TABLE_NAME}, ${ARTICLE_COMMENT_TABLE_NAME} from ${ARTICLE_TABLE_NAME} left join ${ARTICLE_COMMENT_TABLE_NAME} on ${ARTICLE_TABLE_NAME}.id = ${ARTICLE_COMMENT_TABLE_NAME}.articleId where ${ARTICLE_TABLE_NAME}.id = ${id}`)
	},
	async createArticleComment(id, data) {
		let sqlStatement = `insert into ${ARTICLE_COMMENT_TABLE_NAME} (articleId, userId, content, createTime) values (?, ?, ?, ?)`;
		let currentDate = new Date().toLocaleString();
		return query(sqlStatement, [id, data.userId, data.content, currentDate])
	},
	async getArticleCommentList(id) {
		return query(`select a.*, b.username userName from ${ARTICLE_COMMENT_TABLE_NAME} a left join user_info b ON a.userId = b.id where a.articleId=${id}`)
	}
};
module.exports = article;
