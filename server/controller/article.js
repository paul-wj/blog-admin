const articleSql = require('../sql/article');
const createResponse = require('../utils/create-response');
const article = {
	async getArticleAllList(ctx) {
		let res = await articleSql.getArticleAllList();
		let response = createResponse(true);
		if (res && res.length) {
			response.message = '成功';
			response.results = res;
		} else {
			response.code = 404;
			response.message = '信息不存在';
	}
		ctx.body = response;
	}
};

module.exports = article;
