const articleSql = require('../sql/article');
const {getUserInfo} = require('../sql/user');
const {html_decode} = require('../utils');
const {getTokenResult} = require('../utils/check-token');
const createResponse = require('../utils/create-response');
const article = {
	async getArticleAllList(ctx) {
		let res = await articleSql.getArticleAllList();
		let response = createResponse(true);
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			res = res.map(item => Object.assign({},
				item, {content: html_decode(item.content),
					tagIds: item.tagIds.split(',').map(item => item - 0),
					categories: item.categories.split(',').map(item => item - 0)}));
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
			let result = res[0];
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
	},
	async getArticleCommentList(ctx) {
		const id = ctx.params.id;
		let response = createResponse(true);
		let res = await articleSql.getArticleCommentList(id);
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			let promiseList = [];
			res.forEach(item => {
				promiseList.push(getUserInfo(item.userId).then(res => {
					item.userName = res[0].name;
				}))
			});
			await Promise.all(promiseList);
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
