const Router = require('koa-router');
const aboutModel = require('../controller/about');
let about = new Router();

about
	.get('/about/comment', async ctx => aboutModel.getAboutCommentList(ctx))
	.post('/about/comment', async ctx => aboutModel.createAboutComment(ctx))
	.post('/about/reply', async ctx => aboutModel.createAboutCommentReply(ctx))
;
module.exports = about;
