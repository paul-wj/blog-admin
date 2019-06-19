const Joi = require('joi');
const UserSchema = require('../schemas/user');

const createResponse = require('../utils/create-response');
const userSql = require('../sql/user');
const { createToken, verifyToken } = require('../utils/check-token');
const user = {
	async login(ctx) {
		const requestBody = ctx.request.body;
		const response = createResponse();
		const {email, password} = requestBody;
		const validator = Joi.validate(requestBody, UserSchema.login);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		let res = await userSql.queryUseExists({email, password});
		if (res && res.length) {
			response.message = '成功';
			const userInfo = res[0];
			response.result = Object.assign({}, userInfo, {token: createToken(Object.assign({}, userInfo))});
			delete response.result.password;
		} else {
			response.code = 400;
			response.message = '账号或密码错误';
		}
		ctx.body = response;
	},
	async registerUser(ctx) {
		const requestBody = ctx.request.body;
		const response = createResponse();
		const {email, username, password, profilePicture} = requestBody;
		const validator = Joi.validate(requestBody, UserSchema.registerUser);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		const findUser = await userSql.queryUseExists({email, password});
		if (findUser && findUser.length > 0) {
			return ctx.body = {code: 400, message: '当前用户已注册'}
		}
		let res = await userSql.registerUser({email, username, password, profilePicture});
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
	},

	async updateUser(ctx) {
		const id = ctx.params.id;
		const requestBody = ctx.request.body;
		const response = createResponse();
		const {email, username, password, oldPassword, profilePicture} = requestBody;
		const validator = Joi.validate(requestBody, UserSchema.updateUser);
		if (validator.error) {
			return ctx.body = {code: 400, message: validator.error.message}
		}
		const findUser = await userSql.queryUseExists(oldPassword ? {email, password: oldPassword} : {email, password});
		let findUserInfo;
		if (findUser && findUser.length > 0) {
			findUserInfo = findUser[0];
		} else {
			return ctx.body = {code: 400, message:  `${oldPassword ? '原' : ''}密码错误`}
		}

		let res = await userSql.updateUser(id, {email, username, password, profilePicture});
		if (res && res.insertId - 0 > 0) {
			response.message = `成功`;
		}
		//更改用户最新信息后获取最新用户信息详情
		const updateUser = await userSql.getUserInfo(id);
		const updateUserInfo = updateUser[0];
		response.result = Object.assign({}, updateUserInfo, {token: createToken(Object.assign({}, updateUserInfo))});
		delete response.result.password;
		ctx.body = response;
	},
	async checkUserAuth(ctx) {
		const response = createResponse();
		const authorization = ctx.header.authorization;
		let hasToken = verifyToken(authorization);
		if (authorization && hasToken === true) {
			response.message = '成功'
		} else {
			response.code = 900;
			response.message = '登录信息不存在!'
		}
		ctx.body = response;
	}
};

module.exports = user;
