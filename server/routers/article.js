const Router = require('koa-router');
const articleModel = require('../controller/article');
let article = new Router();

article
	.get('/article', async ctx => articleModel.getArticleAllList(ctx))
	.get('/article/:id', async ctx => articleModel.getArticleById(ctx))
	.post('/article', async ctx => articleModel.createArticle(ctx))
	.patch('/article/:id', async ctx => articleModel.editArticle(ctx))
	.delete('/article/:id', async ctx => articleModel.deleteArticle(ctx))
	.get('/article/comment/:id', async ctx => articleModel.getArticleCommentList(ctx))
	.post('/article/comment/:id', async ctx => articleModel.createArticleComment(ctx))
;
module.exports = article;
