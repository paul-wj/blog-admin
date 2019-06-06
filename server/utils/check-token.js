const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'abc';
const whiteList = [
	{url: '/user', method: 'post'},
	{url: '/login', method: 'post'}
];
const createToken = (contentOptions) => {
	if (!contentOptions) {
		return
	}
	return jwt.sign(contentOptions, PRIVATE_KEY, {
		expiresIn: 60*60*2
	})
};

const verifyToken = token => {
	let result;
	jwt.verify(token, PRIVATE_KEY, (err, decode) => {
		result =  err ? {err} : true;
	});
	return result;
};

const getTokenResult = token => {
	let result;
	jwt.verify(token, PRIVATE_KEY, (err, decode) => {
		result =  err ? null : decode;
	});
	return result;
};

const checkToken = (ctx, next) => {
	let url = ctx.url.split('?')[0];
	//whiteList.some(router => url === router.url && [router.method.toUpperCase(), 'OPTIONS'].includes(ctx.method))
	//get请求和options请求直接通过
	if (['OPTIONS', 'GET'].includes(ctx.method) || whiteList.some(router => url === router.url && [router.method.toUpperCase(), 'OPTIONS'].includes(ctx.method))) {
		return next();
	}
	const authorization = ctx.header.authorization;
	let hasToken = verifyToken(authorization);
	return hasToken === true ? next() : ctx.body = {
		code: 900,
		message: authorization ? '登录状态已失效，请重新登录' : '请登录后进行当前操作',
		result: null
	};
};

module.exports = {createToken, verifyToken, checkToken, getTokenResult};
