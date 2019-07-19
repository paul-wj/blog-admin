const Router = require('koa-router');
const userModel = require('../controller/user');
let user = new Router();

user
	.post('/login', async ctx => userModel.login(ctx))
	.delete('/login-out', async ctx => userModel.loginOut(ctx))
	.post('/user', async ctx => userModel.registerUser(ctx))
	.patch('/user/:id', async ctx => userModel.updateUser(ctx))
	.get('/user/check-auth', async ctx => userModel.checkUserAuth(ctx))
	.get('/user/page', async ctx => userModel.getUserList(ctx));

module.exports = user;
