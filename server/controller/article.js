const Joi = require('joi');
const ArticleSchema = require('../schemas/article');

const createResponse = require('../utils/create-response');
const articleSql = require('../sql/article');
const {html_decode} = require('../utils');
const {getTokenResult} = require('../utils/check-token');

const article = {
	async getArticleAllList(ctx) {
		let res = await articleSql.getArticleAllList();
		let response = createResponse(true);
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			const deleteKeyList = ['commentId', 'commentContent', 'commentCreateTime'];
			let result = Array.from(new Set(res.map(item => item.id))).map(articleId => {
				let articleInfo = {};
				let comments = [];
				res.filter(article => article.id === articleId).forEach(currentArticleInfo => {
					articleInfo = Object.assign(articleInfo, currentArticleInfo);
					if (currentArticleInfo.commentId) {
						comments.push({commentId: currentArticleInfo.commentId, content: currentArticleInfo.commentContent, createTime: currentArticleInfo.commentCreateTime})
					}
				});
				articleInfo = Object.assign(articleInfo, {comments});
				deleteKeyList.forEach(item => delete articleInfo[item]);
				return articleInfo;
			});
			result = result.map(item => Object.assign({},
				item, {content: html_decode(item.content),
					tagIds: item.tagIds.split(',').map(item => item - 0),
					categories: item.categories.split(',').map(item => item - 0)}));
			response.results = result;
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async getArticleById(ctx) {
		let id = ctx.params.id;
		let response = createResponse();
		if (!id) {
			response.message = '当前文章不存在（id为空）';
			return ctx.body = response
		}
		let res = await articleSql.getArticleById(id);
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			const deleteKeyList = ['commentId', 'commentContent', 'commentCreateTime'];
			let result = {};
			let comments = [];
			res.forEach(currentArticleInfo => {
				if (!result.id) {
					result = Object.assign(result, currentArticleInfo);
				}
				comments.push({commentId: currentArticleInfo.commentId, content: currentArticleInfo.commentContent, createTime: currentArticleInfo.commentCreateTime})
			});
			result = Object.assign(result, {comments});
			deleteKeyList.forEach(item => delete result[item]);
			result = Object.assign({}, result, {
				content: html_decode(result.content),
				tagIds: result.tagIds.split(',').map(item => item - 0),
				categories: result.categories.split(',').map(item => item - 0)});
			response.result = result;
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async createArticle(ctx) {
		let requestBody = ctx.request.body;
		let response = createResponse();
		let {title, tagIds, categories, content} = requestBody;
		const validator = Joi.validate(requestBody, ArticleSchema.createArticle);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		tagIds = tagIds.toString();
		categories = categories.toString();
		let res = await articleSql.createArticle({title, tagIds, categories, content});
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async editArticle(ctx) {
		let requestBody = ctx.request.body;
		let id = ctx.params.id;
		let response = createResponse();
		if (!id) {
			response.message = '当前文章不存在（id为空）';
			return ctx.body = response
		}
		if (!requestBody.title) {
			response.message = '文章标题不能为空';
			return ctx.body = response
		}
		if (!requestBody.tagIds) {
			response.message = '文章标签不能为空';
			return ctx.body = response
		}
		if (!requestBody.categories) {
			response.message = '文章目录不能为空';
			return ctx.body = response
		}
		if (!requestBody.content) {
			response.message = '文章内容不能为空';
			return ctx.body = response
		}
		let res = await articleSql.editArticle(id, requestBody);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async deleteArticle(ctx) {
		let id = ctx.params.id;
		let response = createResponse();
		if (!id) {
			response.message = '当前文章不存在（id为空）';
			return ctx.body = response
		}
		let res = await articleSql.deleteArticle(id);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async getArticleCommentList(ctx) {
		const id = ctx.params.id;
		let response = createResponse(true);
		let res = await articleSql.getArticleCommentList(id);
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			response.results = res;
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;

	},
	async createArticleComment(ctx) {
		const userInfo = getTokenResult(ctx.header.authorization);
		const id = ctx.params.id;
		const requestBody = ctx.request.body;
		let response = createResponse();
		if (!userInfo) {
			response.message = '请登录后评论';
			return ctx.body = response
		}
		if (!id) {
			response.message = '当前文章不存在（id为空）';
			return ctx.body = response
		}
		if (!requestBody.content) {
			response.message = '当前文章评论不能为空';
			return ctx.body = response
		}
		let res = await articleSql.createArticleComment(id, {userId: userInfo.id, content: requestBody.content});
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	}
};

module.exports = article;
