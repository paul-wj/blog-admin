const koaLogger = require('koa-logger');
const {getTokenResult} = require('./check-token');
const {createLogger} = require('../sql/logger');
const {formatDate} = require('./index');

module.exports = async function logger(ctx, next) {
	const userInfo = await getTokenResult(ctx.header.authorization);
	const {request} = ctx;
	const {method, url, header} = request;
	const {host, origin, cip} = header;
	const loggerData = {
		userName: userInfo ? userInfo.username : null,
		userId: userInfo ? userInfo.id : null,
		method: method,
		url: url,
		host: host,
		origin: origin,
		userAgent: request.header['user-agent'],
		ip: cip,
		status: null
	};
	return koaLogger((str, args) => {
		console.log(str, `time:${formatDate(new Date())}`, `ip:${cip}`);
		let status = args[3];
		if (status) {
			loggerData.status = status;
			createLogger(loggerData);
		}
	})(ctx, next)
};
