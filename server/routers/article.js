const Router = require('koa-router');
const articleModel = require('../controller/article');
let article = new Router();

article
	.get('/article', async ctx => articleModel.getArticleAllList(ctx));
module.exports = article;
