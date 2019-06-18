const {html_encode} = require('../utils');
const {query} = require('../utils/async-db');
const databaseNameList = require('../../config/index').databaseNameList;
const {ARTICLE_TABLE_NAME, ARTICLE_COMMENT_TABLE_NAME, ARTICLE_REPLY_TABLE_NAME, USER_TABLE_NAME} = databaseNameList;
const article = {
	async getArticleAllList() {
		return query(`select * from ${ARTICLE_TABLE_NAME} group by createTime desc`)
		// return query(`SELECT a.*, b.id commentId, b.content commentContent, b.createTime commentCreateTime, c.username userName
		// FROM ${ARTICLE_TABLE_NAME} a LEFT JOIN ${ARTICLE_COMMENT_TABLE_NAME} b
		// ON a.id = b.articleId LEFT JOIN ${USER_TABLE_NAME} c ON b.userId = c.id;`)
	},
	async getArticlePageList(params) {
		const {limit, offset, title} = params;
		return query(`select sql_calc_found_rows  * from ${ARTICLE_TABLE_NAME} where title like '%${title || ''}%' group by createTime desc limit ${limit} offset ${offset};SELECT FOUND_ROWS() as total;`)
	},
	async getArticleById(id) {
		return query(`select * from ${ARTICLE_TABLE_NAME} where id=${id}`);
		// return query(`SELECT a.*, b.id commentId, b.content commentContent, b.createTime commentCreateTime, b.userId, c.username userName
		// FROM ${ARTICLE_TABLE_NAME} a LEFT JOIN ${ARTICLE_COMMENT_TABLE_NAME} b
		// ON a.id = b.articleId LEFT JOIN ${USER_TABLE_NAME} c ON b.userId = c.id where a.id=${id};`)
	},
	async getArticlePageListByCategoryId(params) {
		const {categoryId, limit, offset} = params;
		return query(`select sql_calc_found_rows * from ${ARTICLE_TABLE_NAME} where FIND_IN_SET(${categoryId}, categories) group by createTime desc limit ${limit} offset ${offset};SELECT FOUND_ROWS() as total;`);
	},
	async getArticlePageListByTagId(params) {
		const {tagId, limit, offset} = params;
		return query(`select sql_calc_found_rows * from ${ARTICLE_TABLE_NAME} where FIND_IN_SET(${tagId}, tagIds) group by createTime desc limit ${limit} offset ${offset};SELECT FOUND_ROWS() as total;`);
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
	async getArticleCommentAllList() {
		return query(`select * from ${ARTICLE_COMMENT_TABLE_NAME} group by createTime desc`)
	},
	async getArticleCommentList(id) {
		return query(`select a.*, b.username userName from ${ARTICLE_COMMENT_TABLE_NAME} a left join ${USER_TABLE_NAME} b ON a.userId = b.id where a.articleId=${id}`)
	},
	async deleteArticleComment(commentId) {
		return query(`delete ${ARTICLE_COMMENT_TABLE_NAME}, ${ARTICLE_REPLY_TABLE_NAME} from ${ARTICLE_COMMENT_TABLE_NAME} left join ${ARTICLE_REPLY_TABLE_NAME} on ${ARTICLE_COMMENT_TABLE_NAME}.id = ${ARTICLE_REPLY_TABLE_NAME}.commentId where ${ARTICLE_COMMENT_TABLE_NAME}.id = ${commentId}`)
	},
	async createArticleCommentReply(commentId, {type, content, userId, toUserId, replyWay, replyId}) {
		const currentDate = new Date().toLocaleString();
		let sqlStatement = `insert into ${ARTICLE_REPLY_TABLE_NAME} (commentId, replyWay, replyId, userId, toUserId, content, type, createTime) values (?, ?, ?, ?, ?, ?, ?, ?)`;
		return query(sqlStatement, [commentId, replyWay, replyId, userId, toUserId, content, type, currentDate]);
	},
	async deleteArticleCommentReplyByReplyId(replyId, isReply = true) {
		return query(`delete from ${ARTICLE_REPLY_TABLE_NAME} where id = ${replyId} ${isReply ? `or (replyWay=20 and replyId=${replyId})` : ''}`)
	},
	async getArticleCommentAllReplyList() {
		return query(`select * from ${ARTICLE_REPLY_TABLE_NAME} group by createTime desc`)
	},
	async getArticleCommentReplyListByCommentId(commentId) {
		return query(`select reply.*, user.username userName, toUser.username toUserName from ${ARTICLE_REPLY_TABLE_NAME} reply left join ${USER_TABLE_NAME} user ON reply.userId = user.id left join ${USER_TABLE_NAME} toUser on reply.toUserId = toUser.id where reply.commentId=${commentId}`)
	},
	async getArticleCommentReplyListByReplyWayAndReplyId(replyWay, replyId) {
		return query(`select reply.*, user.username userName, toUser.username toUserName from ${ARTICLE_REPLY_TABLE_NAME} reply left join ${USER_TABLE_NAME} user ON reply.userId = user.id left join ${USER_TABLE_NAME} toUser on reply.toUserId = toUser.id where reply.replyWay=${replyWay} and reply.replyId=${replyId}`)
	}
};
module.exports = article;
