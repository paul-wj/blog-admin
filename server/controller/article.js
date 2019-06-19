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
			async function processArray(arr) {
				for (let item of arr) {
					let commentList = await articleSql.getArticleCommentList(item.id);
					item.comments = commentList.length;
					item.content = '';//减小异步请求size
					item.tagIds = item.tagIds.split(',').map(item => item - 0);
					item.categories = item.categories.split(',').map(item => item - 0);
				}
			}
			await processArray(res);
			response.results = res;
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	/**
	 * 获取文章分页列表
	 * @param ctx
	 * @param isSimple
	 * @returns {Promise<{code: number, message: *}>}
	 */
	async getArticlePageList(ctx, isSimple = false) {
		const {title, limit, offset} = ctx.query;
		const requestBody = {title, limit, offset};
		const validator = Joi.validate(requestBody, ArticleSchema.getArticlePageList);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let response = createResponse();
		let res = await articleSql.getArticlePageList(requestBody);
		let articlePageList = res[0];
		const total = res[1][0].total;
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			if (!isSimple) {
				async function processArray(arr) {
					for (let item of arr) {
						let commentList = await articleSql.getArticleCommentList(item.id);
						const htmlContent = html_decode(item.content);
						const index = htmlContent.indexOf('<!--more-->');
						item.comments = commentList.length;
						item.content = index > -1 ? htmlContent.slice(0, index) : htmlContent;
						item.tagIds = item.tagIds.split(',').map(item => item - 0);
						item.categories = item.categories.split(',').map(item => item - 0);
					}
				}
				await processArray(articlePageList);
			} else {
				articlePageList = articlePageList.map(item => Object.assign({}, item, {content: ''}))
			}
			response.result = {items: articlePageList, total, limit: limit - 0, offset: offset - 0}
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
			let result = res[0];
			response.code = 0;
			response.message = '成功';
			const commentList = await articleSql.getArticleCommentList(result.id);
			result = Object.assign(result, {comments: commentList.length});
			response.result = Object.assign({}, result, {
				content: html_decode(result.content),
				tagIds: result.tagIds.split(',').map(item => item - 0),
				categories: result.categories.split(',').map(item => item - 0)});
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async getArticlePageListByCategoryId(ctx) {
		const categoryId = ctx.params.id;
		const {limit, offset} = ctx.query;
		const requestBody = {categoryId, limit, offset};
		const validator = Joi.validate(requestBody, ArticleSchema.getArticlePageListByCategoryId);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let response = createResponse();
		let res = await articleSql.getArticlePageListByCategoryId(requestBody);
		const articlePageList = res[0];
		const total = res[1][0].total;
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			response.result = {items: articlePageList.map(item => Object.assign({}, item, {content: ''})), total, limit: limit - 0, offset: offset - 0}
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async getArticlePageListByTagId(ctx) {
		const tagId = ctx.params.id;
		const {limit, offset} = ctx.query;
		const requestBody = {tagId, limit, offset};
		const validator = Joi.validate(requestBody, ArticleSchema.getArticlePageListByTagId);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let response = createResponse();
		let res = await articleSql.getArticlePageListByTagId(requestBody);
		const articlePageList = res[0];
		const total = res[1][0].total;
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			response.result = {items: articlePageList.map(item => Object.assign({}, item, {content: ''})), total, limit: limit - 0, offset: offset - 0}
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
			async function processArray(arr) {
				for (let item of arr) {
					//回复类型（10：点赞，20：踩,  30: 文字回复）
					const replyAllList = await articleSql.getArticleCommentReplyListByCommentId(item.id);
					let likes = 0, dislikes = 0, replyList = [], isReply = false;
					let replyToReplyList = [];
					replyAllList.forEach(reply => {
						//当评论方式为评论回复时
						if (reply.replyWay === 10) {
							if (reply.type !== 30) {
								reply.type === 10 ? likes++ : dislikes++
							}
						} else {
							replyToReplyList.push(reply);
						}
						if (reply.type === 30) {
							replyList.push(Object.assign({}, reply, {isReply, likes: 0, dislikes: 0}));
						}
					});
					replyList = replyList.map(reply => {
						let likes = 0, dislikes = 0;
						replyToReplyList.forEach(item => {
							if (item.type !== 30 && item.replyId === reply.id) {
								item.type === 10 ? likes++ : dislikes++
							}
						});
						return Object.assign({}, reply, {likes, dislikes})
					});
					item.reply = {likes, dislikes, replyList};
				}
			}
			await processArray(res);
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
	},
	async deleteArticleComment(ctx) {
		let commentId = ctx.params.id;
		const requestBody = {commentId};
		const validator = Joi.validate(requestBody, ArticleSchema.deleteArticleComment);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let response = createResponse();
		let res = await articleSql.deleteArticleComment(commentId);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async createArticleCommentReply(ctx) {
		const userInfo = getTokenResult(ctx.header.authorization);
		const commentId = ctx.params.id;
		const userId = userInfo.id;
		const {type, content, toUserId, replyWay, replyId} = ctx.request.body;
		//回复方式为10时replyId为commentId，回复方式为20时replyId为replyId
		const requestBody = {commentId, type, content, toUserId, userId, replyWay, replyId: replyWay === 10 ? commentId : replyId};
		const validator = Joi.validate(requestBody, ArticleSchema.createArticleCommentReply);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let response = createResponse();
		let res;
		if (toUserId === userId) {
			return ctx.body = {code: 400, message: `当前未开放自己为自己${type === 10 ? '点赞' : type === 30 ?  '评论' : '踩'}功能!`}
		}
		const replyList = await articleSql.getArticleCommentReplyListByReplyWayAndReplyId(replyWay, replyWay === 10 ? commentId : replyId);
		if ([10, 20].includes(type)) {
			let replyIndex = replyList.findIndex(item => item.userId === userId && item.type === type);
			res = replyIndex > -1 ?  await articleSql.deleteArticleCommentReplyByReplyId(replyList[replyIndex].id, false) : await articleSql.createArticleCommentReply(requestBody.commentId, requestBody);
		} else {
			res = await articleSql.createArticleCommentReply(requestBody.commentId, requestBody);
		}
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async deleteArticleCommentReply(ctx) {
		let replyId = ctx.params.id;
		const requestBody = {replyId};
		const validator = Joi.validate(requestBody, ArticleSchema.deleteArticleCommentReply);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let response = createResponse();
		let res = await articleSql.deleteArticleCommentReplyByReplyId(replyId);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	}
};

module.exports = article;
