import http, {Server} from 'http';
import zlib from 'zlib';
import Koa from 'koa';
import koaCompress from 'koa-compress';
import koaStatic from 'koa-static';
import koaHelmet from 'koa-helmet';
import koaBody from 'koa-body';
import koaBodyParser from 'koa-bodyparser';
import koaCors from 'koa2-cors';
import koaLogger from 'koa-logger';
import { startWebSocketApp } from "./lib/utils/webSocket";
import {checkTokenMiddleware} from './middleware/verify-token';
import router, {koaRouterOpts} from './router';
import {
    staticPathConfig,
    globalConfig,
    crosOptions
} from './conf';

const app = new Koa();

const server: Server = new http.Server(app.callback());

//配置webSocket
startWebSocketApp(server);

//当响应体比较大时，koa-compose启用类似Gzip的压缩技术减少传输内容
app.use(koaCompress({
    threshold: 1024,
    flush: zlib.Z_SYNC_FLUSH
}));

//配置koa-static静态文件服务器
app.use(koaStatic(staticPathConfig.STATIC_PATH));

//koa-helmet 通过增加如Strict-Transport-Security, X-Frame-Options, X-Frame-Options等HTTP头提高koa2应用程序的安全性
app.use(koaHelmet());

//配置koa-body中间件,兼容koa-bodyparser 中间件不支持 form-data 类型。
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFieldsSize: 10 * 1024 * 1024,
    }
}));

app.use(koaBodyParser());

app.use(koaCors(crosOptions));

app.use(koaLogger());

app.use(checkTokenMiddleware);

app.use(router.routes()).use(router.allowedMethods());

server.listen(globalConfig.port, () => {
    console.log(`
    Server running on port http://localhost:${globalConfig.port}
    Swagger docs avaliable at http://localhost:${globalConfig.port}${koaRouterOpts.prefix}/swagger-html
    `)
});
