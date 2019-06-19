const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const whiteList = [
	{url: '/user', method: 'post'},
	{url: '/login', method: 'post'},
	{url: '/upload', method: 'post'}
];
const createToken = (contentOptions) => {
	if (!contentOptions) {
		return
	}
	let privateKey = fs.readFileSync(config.PRIVATE_KEY);
	return jwt.sign(contentOptions, privateKey, {
		expiresIn: 60*60*2,
		algorithm: 'RS256'
	})
};

const verifyToken = token => {
	let result;
	const cert = fs.readFileSync(config.PRIVATE_KEY);
	jwt.verify(token, cert, (err, decode) => {
		result =  err ? {err} : true;
	});
	return result;
};

const getTokenResult = token => {
	let result;
	const cert = fs.readFileSync(config.PRIVATE_KEY);
	jwt.verify(token, cert, (err, decode) => {
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
