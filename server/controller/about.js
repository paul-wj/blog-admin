const Joi = require('joi');
const aboutSql = require('../sql/about');
const {getTokenResult} = require('../utils/check-token');
const AboutSchema = require('../schemas/about');
const createResponse = require('../utils/create-response');
const {webSocketObj} = require('../utils/web-socket');
const {formatDate} = require('../utils/index');


const about = {
	//创建关于模块留言
	async createAboutComment(ctx) {
		const userInfo = await getTokenResult(ctx.header.authorization);
		const {id: userId} = userInfo || {id: null};
		const {content} = ctx.request.body;
		const params = {userId, content};
		const validator = Joi.validate(params, AboutSchema.createAboutComment);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let response = createResponse();
		const res = await aboutSql.createAboutComment(params);
		if (res && res.insertId !== undefined) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	//获取关于模块留言列表
	async getAboutCommentList(ctx) {
		let response = createResponse(true);
		const res = await aboutSql.getAboutCommentList();
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			async function processArray(arr) {
				for (let item of arr) {
					item.replyList = await aboutSql.getAboutCommentReplyList(item.id);
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
	//创建关于模块留言回复
	async createAboutCommentReply(ctx) {
		const userInfo = await getTokenResult(ctx.header.authorization);
		const {id: userId} = userInfo || {id: null};
		const {replyType, sendId, commentId, replyId, content} = ctx.request.body;
		const params = {replyType, userId, sendId, commentId, replyId, content};
		const validator = Joi.validate(params, AboutSchema.createAboutCommentReply);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let response = createResponse();
		const res = replyType === 10 ? await aboutSql.createAboutCommentReply(params) : await aboutSql.createAboutCommentReplyToReply(params);
		if (res && res.insertId !== undefined) {
			response.message = '成功';
		}
		ctx.body = response;
	}
};

module.exports = about;
