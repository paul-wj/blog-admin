const fs = require('fs');
const fnv = require('fnv-plus');
const jwt = require('jsonwebtoken');
const redis = require('../utils/redis');
const config = require('../../config');
const whiteList = [
	{url: '/user', method: 'post'},
	{url: '/login', method: 'post'},
	{url: '/upload', method: 'post'}
];
const jwtExpiresIn = 60*60*24*14;
const expiresIn = 60*60*2;
const createToken = (contentOptions) => {
	if (!contentOptions) {
		return
	}
	let privateKey = fs.readFileSync(config.PRIVATE_KEY);
	const {id} = contentOptions;
	const jwtToken = jwt.sign(contentOptions, privateKey, {expiresIn: jwtExpiresIn, algorithm: 'RS256'});
	redis.set(`user_${id}`, jwtToken, 'EX', expiresIn);
	return jwtToken;
};

const verifyToken = async token => {
	if (!token) {
		return false
	}
	let result;
	const cert = fs.readFileSync(config.PUBLIC_KEY);
	await jwt.verify(token, cert, async (err, decode) => {
		if (err) {
			console.log({err});
			result = null;
		} else {
			await redis.get(`user_${decode.id}`, function (err, res) {
				result = res !== null || !!err;
			});
			if (result) {
				await redis.expire(`user_${decode.id}`, expiresIn)
			}
		}
	});
	return result;
};

const getTokenResult = async token => {
	if (!token) {
		return false
	}
	let result;
	const cert = fs.readFileSync(config.PUBLIC_KEY);
	await jwt.verify(token, cert, async (err, decode) => {
		if (err) {
			console.log({err}, 21312);
			result = null;
		} else {
			await redis.get(`user_${decode.id}`, function (err, res) {
				result = res !== null || !!err;
			});
			result = result ? decode : null;
		}
	});
	return result;
};

const checkToken = async (ctx, next) => {
	const authorization = ctx.header.authorization;
	let url = ctx.url.split('?')[0];
	//whiteList.some(router => url === router.url && [router.method.toUpperCase(), 'OPTIONS'].includes(ctx.method))
	//get请求和options请求直接通过
	if (['OPTIONS', 'GET'].includes(ctx.method) || whiteList.some(router => url === router.url && [router.method.toUpperCase(), 'OPTIONS'].includes(ctx.method))) {
		if (authorization) {
			verifyToken(authorization);
		}
		return next();
	}
	let hasToken = await verifyToken(authorization);
	return hasToken === true ? next() : ctx.body = {
		code: 900,
		message: authorization ? '登录状态已失效，请重新登录' : '请登录后进行当前操作',
		result: null
	};
};

module.exports = {createToken, verifyToken, checkToken, getTokenResult};
