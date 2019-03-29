// require('./init');
const Koa = require('koa');
const helmet = require('helmet');
const bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const cors = require('./server/utils/set-cors');
const {checkToken} = require('./server/utils/check-token');

const config = require('./config');
const router = require('./server/routers/index');
const app = new Koa();
// 配置控制台日志中间件
app.use(koaLogger());

// 配置ctx.body解析中间件
app.use(bodyParser());
//配置跨域cors
app.use(cors);
//检查token
app.use(checkToken);

app.use(router.routes()).use(router.allowedMethods());
app.use(helmet());
app.listen(config.port);
console.log(`starting at port:${config.port}`);
