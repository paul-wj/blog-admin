const Joi = require('joi');

const getArticlePageList = Joi.object().keys({
	title: Joi.string(),
	limit: Joi.number().required().error(new Error('页码不能为空')),
	offset: Joi.number().required().error(new Error('起始行不能为空')),
});

const getArticlePageListByCategoryId = Joi.object().keys({
	categoryId: Joi.number().required().error(new Error('目录Id不能为空')),
	limit: Joi.number().required().error(new Error('页码不能为空')),
	offset: Joi.number().required().error(new Error('起始行不能为空')),
});

const getArticlePageListByTagId = Joi.object().keys({
	tagId: Joi.number().required().error(new Error('标签Id不能为空')),
	limit: Joi.number().required().error(new Error('页码不能为空')),
	offset: Joi.number().required().error(new Error('起始行不能为空')),
});



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

const deleteArticleCommentReply = Joi.object().keys({
	replyId: Joi.string().required().error(new Error('replyId不能为空'))
});

const deleteArticleComment = Joi.object().keys({
	commentId: Joi.string().required().error(new Error('commentId不能为空'))
});

module.exports = {
	createArticle,
	editArticle,
	getArticleList,
	createArticleCommentReply,
	deleteArticleCommentReply,
	deleteArticleComment,
	getArticlePageList,
	getArticlePageListByCategoryId,
	getArticlePageListByTagId
};
