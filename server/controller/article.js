const articleSql = require('../sql/article');
const {html_decode} = require('../utils');
const createResponse = require('../utils/create-response');
const article = {
	async getArticleAllList(ctx) {
		let res = await articleSql.getArticleAllList();
		let response = createResponse(true);
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			res = res.map(item => Object.assign({}, item, {content: html_decode(item.content)}));
			response.results = res;
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
			res[0].content = html_decode(res[0].content);
			response.result = res[0];
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async createArticle(ctx) {
		let requestBody = ctx.request.body;
		let response = createResponse();
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
		let res = await articleSql.createArticle(requestBody);
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
	}
};

module.exports = article;
