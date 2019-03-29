const Router = require('koa-router');
const userModel = require('../controller/user');
let user = new Router();

user
	.get('/login', async ctx => userModel.login(ctx))
	.post('/user/create', async ctx => userModel.createUser(ctx))
	.get('/user/page/list', async ctx => userModel.getUserList(ctx));

module.exports = user;
