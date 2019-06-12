const Router = require('koa-router');
const articleModel = require('../controller/article');
let article = new Router();

article
	.get('/article', async ctx => articleModel.getArticleAllList(ctx))
	.get('/article/page', async ctx => articleModel.getArticlePageList(ctx))
	.get('/article/page/simple', async ctx => articleModel.getArticlePageList(ctx, true))
	.get('/article/:id', async ctx => articleModel.getArticleById(ctx))
	.post('/article', async ctx => articleModel.createArticle(ctx))
	.patch('/article/:id', async ctx => articleModel.editArticle(ctx))
	.delete('/article/:id', async ctx => articleModel.deleteArticle(ctx))
	.get('/article/comment/:id', async ctx => articleModel.getArticleCommentList(ctx))
	.post('/article/comment/:id', async ctx => articleModel.createArticleComment(ctx))
	.delete('/article/comment/:id', async ctx => articleModel.deleteArticleComment(ctx))
	.post('/article/reply/:id', async ctx => articleModel.createArticleCommentReply(ctx))
	.delete('/article/reply/:id', async ctx => articleModel.deleteArticleCommentReply(ctx))
;
module.exports = article;
