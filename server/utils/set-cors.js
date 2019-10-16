const config = require('../../config/index');
const cors = require('koa2-cors');
const {IS_LOCAL} = config;
const localWhiteList = ['http://localhost:3000', 'http://188.188.188.233:3000',  'http://188.188.188.233:8081'];
const whiteList = [ 'http://118.24.181.75:3000', 'http://www.wangjie818.wang:3000'];
const crosOptions = {
	origin: ctx => {
		if (ctx.request.header.origin !== ctx.origin && (IS_LOCAL ? localWhiteList: whiteList).includes(ctx.request.header.origin)) {
			return ctx.request.header.origin
		}
	},    //允许访问的来源地址
	maxAge: 60*60,                                                                      //设置预检请求有效期（单位: s）
	credentials: false,                                                               //是否允许传输cookie（如果为true需要保证origin为*）
	allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'], //设置请求支持的类型
	allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with', 'cip'],                   //请求服务器支持的所有头信息字段
};
module.exports = cors(crosOptions);


