const koaLogger = require('koa-logger');
const {getTokenResult} = require('./check-token');
const {createLogger} = require('../sql/logger');

module.exports = async function logger(ctx, next) {
	const userInfo = await getTokenResult(ctx.header.authorization);
	const {request} = ctx;
	const loggerData = {
		userName: userInfo ? userInfo.username : null,
		userId: userInfo ? userInfo.id : null,
		method: request.method,
		host: request.header.host,
		origin: request.header.origin,
		userAgent: request.header['user-agent'],
		url: request.url,
		status: null
	};
	return koaLogger((str, args) => {
		console.log(str);
		let status = args[3];
		if (status) {
			loggerData.status = status;
			createLogger(loggerData);
		}
	})(ctx, next)
};
