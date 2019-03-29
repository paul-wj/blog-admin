const cors = require('koa2-cors');
const whiteList = ['http://localhost:8080'];
const crosOptions = {
	origin: ctx => {
		if (ctx.request.header.origin !== ctx.origin && whiteList.includes(ctx.request.header.origin)) {
			return ctx.request.header.origin
		}
	},    //允许访问的来源地址
	maxAge: 60*60,                                                                      //设置预检请求有效期（单位: s）
	credentials: false,                                                               //是否允许传输cookie（如果为true需要保证origin为*）
	allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'], //设置请求支持的类型
	allowHeaders: ['Content-Type', 'Authorization', 'Accept'],                   //请求服务器支持的所有头信息字段
};
module.exports = cors(crosOptions);


