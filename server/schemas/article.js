const Joi = require('joi');
const createArticle = Joi.object().keys({
	title: Joi.string().required().error(new Error('标题不能为空')),
	content: Joi.string().allow(''),
	categories: Joi.array(),
	tagIds: Joi.array()
});

const editArticle = Joi.object().keys({
	articleId: Joi.number(),
	title: Joi.string().required().error(new Error('标题不能为空')),
	content: Joi.string(),
	categories: Joi.array(),
	tagIds: Joi.array()
});

const getArticleList = Joi.object().keys({
	page: Joi.number(),
	pageSize: Joi.number(),
	title: Joi.string().allow(''),
	tag: Joi.string().allow(''),
	category: Joi.string().allow('')
});

const createArticleCommentReply = Joi.object().keys({
	commentId: Joi.string().required().error(new Error('commentId不能为空')),
	replyWay: Joi.number().required().error(new Error('回复方式不能为空')),
	replyId: Joi.when('replyWay', {is: 20, then: Joi.number().required().error(new Error('回复id不能为空'))}),
	type: Joi.number().required().error(new Error('回复类型不能为空')),
	userId: Joi.number().required(),
	toUserId: Joi.number().required().error(new Error('回复用户id不能为空')),
	content: Joi.when('type', {is: 30, then: Joi.string().required().error(new Error('回复内容不能为空'))})
});

module.exports = {
	createArticle,
	editArticle,
	getArticleList,
	createArticleCommentReply
};
