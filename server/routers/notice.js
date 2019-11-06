const Router = require('koa-router');
const noticeModel = require('../controller/notice');
const notice = new Router();

notice
	.get('/message-un-read', async ctx => noticeModel.getUnreadMessageList(ctx))
	.post('/message-read', async ctx => noticeModel.createMessageUser(ctx))
	.post('/message-read-batch', async ctx => noticeModel.batchCreateMessageUser(ctx))
;
module.exports = notice;
