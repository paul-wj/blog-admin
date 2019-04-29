const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'abc';
const whiteList = [
	{url: '/user/create', method: 'post'},
	{url: '/login', method: 'post'},
	{url: '/article', method: 'get'},
	{url: '/tag', method: 'get'},
	{url: '/category', method: 'get'}
];
const createToken = (contentOptions) => {
	if (!contentOptions) {
		return
	}
	return jwt.sign(contentOptions, PRIVATE_KEY, {
		expiresIn: 60*60*24*7
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
	if (whiteList.some(router => url === router.url && [router.method.toUpperCase(), 'OPTIONS'].includes(ctx.method))) {
		return next();
	} else{
		let hasToken = verifyToken(ctx.header.authorization);
		return hasToken === true ? next() : ctx.body = {
			code: 900,
			message: hasToken.err.message,
			result: null
		};
	}
};

module.exports = {createToken, verifyToken, checkToken, getTokenResult};
