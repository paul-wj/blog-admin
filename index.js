// require('./init');
const Koa = require('koa');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const logger = require('./server/utils/logger');
const cors = require('./server/utils/set-cors');
const {checkToken} = require('./server/utils/check-token');
const errorHandle  = require('./server/utils/errorHandle');
const config = require('./config');
const router = require('./server/routers/index');
const app = new Koa();
app.use(helmet());
// 配置ctx.body解析中间件
app.use(bodyParser());
//配置跨域cors
app.use(cors);
//检查token
app.use(checkToken).use(errorHandle);
// 配置控制台日志中间件
app.use(logger);
app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port);
console.log(`starting at port:${config.port}`);
