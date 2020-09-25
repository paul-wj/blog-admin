import log4js from 'log4js';
import {Context, Request} from 'koa';
import logConfig from '../../conf/log4';

// 加载配置文件
log4js.configure(logConfig);

// 调用预先定义的日志名称
const consoleLogger = log4js.getLogger();
const requestLogger = log4js.getLogger('requestLogger');
const responseLogger = log4js.getLogger('responseLogger');
const errorLogger = log4js.getLogger('errorLogger');


// 格式化请求日志
const formatRequestLog = (request: Request, logTime: number): string => {
    const {method, originalUrl, header: {cip: ip}} = request;
    const isGet = method === 'GET';
    return `
request user-agent: ${request.header['user-agent']}     
request method: ${method} 
request originalUrl: ${originalUrl}
request client ip: ${ip}
request ${isGet ? `query` : 'body'}: ${JSON.stringify(isGet ? request.query : request.body)}
response time: ${logTime}`;
};

// 格式化错误日志
const formatErrorLog = (ctx: Context, error: Error, logTime: number): string => {
    return `*************** error log start ***************
${formatRequestLog(ctx.request, logTime)}
error name: ${error.name}
error message: ${error.message}
error stack: ${error.stack}
*************** error log end ***************
`;
};

// 格式化响应日志
const formatResponseLog = (ctx: Context, logTime: number): string => {
    return `
*************** response log start ***************${formatRequestLog(ctx.request, logTime)}
response status: ${ctx.status}
response body: 
${JSON.stringify(ctx.body)}
*************** response log end ***************
`;
};

// 格式化默认日志
const formatDefaultLog = (info: any): string => {
    return `
***************default log start ***************
default detail: ${JSON.stringify(info)}
*************** info log end ***************`;
};

// 错误日志上传触发方法
export const logErrorHandle = (ctx: Context, error: Error, logTime: number): void => {
    if (ctx && error) {
        console.log(error);
        errorLogger.error(formatErrorLog(ctx, error, logTime));
    }
};

// 请求日志上传触发方法
export const logRequestHandle = (ctx: Context, logTime: number): void => {
    if (ctx) {
        requestLogger.info(formatRequestLog(ctx.request, logTime));
    }
};

// 响应日志上传触发方法
export const logResponseHandle = (ctx: Context, logTime: number): void => {
    if (ctx) {
        responseLogger.info(formatResponseLog(ctx, logTime))
    }
};


