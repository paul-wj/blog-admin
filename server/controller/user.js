const userSql = require('../sql/user');
const { createToken } = require('../utils/check-token');
const user = {
	async login(ctx) {
		let response = {
			code: 0,
			result: null,
			message: null
		};
		let {username, password} = ctx.request.body;
		if (!username || !password) {
			response.code = 400;
			response.message = '请输入用户名或密码';
			return ctx.body = response;
		}
		let res = await userSql.queryUseExists({username, password});
		if (res && res.length) {
			response.message = '成功';
			response.result = Object.assign({}, res[0], {
				token: createToken({username, password})
			})
		} else {
			response.code = 400;
			response.message = '用户不存在';
		}
		ctx.body = response;
	},
	async createUser(ctx) {
		let requestBody = ctx.request.body;
		let response = {
			code: 0,
			result: null,
			message: null
		};
		if (!requestBody.userName) {
			response.message = '请输入用户名';
			return ctx.body = response
		}
		if (!requestBody.password) {
			response.message = '请输入用户密码';
			return ctx.body = response
		}
		let res = await userSql.createUser(requestBody);
		if (res && res.insertId - 0 > 0) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async getUserList(ctx) {
		let requestParams = ctx.request.query;
		let response = {
			code: 0,
			results: null,
			message: null
		};
		if (!requestParams.limit || !requestParams.offset) {
			response.message = '请上传分页信息';
			return ctx.body = response;
		}
		if (!requestParams.name) {
			requestParams.name = '';
		}
		let res = await userSql.getUserList(requestParams);
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

module.exports = user;
