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

module.exports = {
	createArticle,
	editArticle,
	getArticleList
};
