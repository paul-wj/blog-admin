// require('./init');
const {startWebSocketApp} = require('./server/utils/web-socket');
const Koa = require('koa');
const helmet = require('koa-helmet');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const compress = require('koa-compress');
const logger = require('./server/utils/logger');
const cors = require('./server/utils/set-cors');
const {checkToken} = require('./server/utils/check-token');
const errorHandle  = require('./server/utils/errorHandle');
const config = require('./config');
const router = require('./server/routers/index');
const app = new Koa();
const server = require('http').Server(app.callback());

//启动webSocket
startWebSocketApp(server);



app.use(compress({
	// filter: function (content_type) {
	// 	// 只有在请求的content-type中有gzip类型，我们才会考虑压缩，因为zlib是压缩成gzip类型的
	// 	return /text/i.test(content_type)
	// },
	threshold: 1024, // 阀值，当数据超过1kb的时候，可以压缩
	flush: require('zlib').Z_SYNC_FLUSH // zlib是node的压缩模块
}));
//配置koa-static静态文件服务器
app.use(koaStatic(config.STATIC_PATH));

app.use(helmet());

//配置koa-body中间件
app.use(koaBody({
	multipart:true,
	formidable:{
		maxFieldsSize:10*1024*1024,
		multipart:true
	}
}));

// 配置ctx.body解析中间件
app.use(bodyParser());

//配置跨域cors
app.use(cors);

//检查token
app.use(checkToken).use(errorHandle);

// 配置控制台日志中间件
app.use(logger);
app.use(router.routes()).use(router.allowedMethods());
server.listen(config.port, () => {
	console.log(`starting at port:${config.port}`);
});


