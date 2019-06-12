const tagCategory = require('../sql/tag-category');
const articleSql = require('../sql/article');
const createResponse = require('../utils/create-response');
const article = {
	async getTagAllList(ctx) {
		let res = await tagCategory.getTagAllList();
		let response = createResponse(true);
		const articleAllList = await articleSql.getArticleAllList();
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			response.results = res.map(tag => Object.assign(tag, {counts: articleAllList.filter(article => article.tagIds.split(',').includes(tag.id + '')).length}));
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async createTag(ctx) {
		let requestBody = ctx.request.body;
		let response = createResponse();
		if (!requestBody.name) {
			response.message = '请输入标签名';
			return ctx.body = response
		}
		if (!requestBody.color) {
			response.message = '请输入标签颜色';
			return ctx.body = response
		}
		let res = await tagCategory.createTag(requestBody);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async editTag(ctx) {
		let requestBody = ctx.request.body;
		let id = ctx.params.id;
		let response = createResponse();
		if (!id) {
			response.message = '当前标签不存在（id为空）';
			return ctx.body = response
		}
		if (!requestBody.name) {
			response.message = '请输入标签名';
			return ctx.body = response
		}
		if (!requestBody.color) {
			response.message = '请输入标签颜色';
			return ctx.body = response
		}
		let res = await tagCategory.editTag(id, requestBody);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async deleteTag(ctx) {
		let id = ctx.params.id;
		let response = createResponse();
		if (!id) {
			response.message = '当前标签不存在（id为空）';
			return ctx.body = response
		}
		let res = await tagCategory.deleteTag(id);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async getCategoryAllList(ctx) {
		let res = await tagCategory.getCategoryAllList();
		let response = createResponse(true);
		const articleAllList = await articleSql.getArticleAllList();
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			response.results = res.map(category => Object.assign(category, {counts: articleAllList.filter(article => article.categories.split(',').includes(category.id + '')).length}));
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async createCategory(ctx) {
		let requestBody = ctx.request.body;
		let response = createResponse();
		if (!requestBody.name) {
			response.message = '请输入目录名';
			return ctx.body = response
		}
		let res = await tagCategory.createCategory(requestBody);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async editCategory(ctx) {
		let requestBody = ctx.request.body;
		let id = ctx.params.id;
		let response = createResponse();
		if (!id) {
			response.message = '当前目录不存在（id为空）';
			return ctx.body = response
		}
		if (!requestBody.name) {
			response.message = '请输入目录名';
			return ctx.body = response
		}
		let res = await tagCategory.editCategory(id, requestBody);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async deleteCategory(ctx) {
		let id = ctx.params.id;
		let response = createResponse();
		if (!id) {
			response.message = '当前目录不存在（id为空）';
			return ctx.body = response
		}
		let res = await tagCategory.deleteCategory(id);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	}
};

module.exports = article;
