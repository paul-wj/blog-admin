import { getTokenResult } from "./verify-token";
import { Context, Next } from "koa";
import ExtraStatement from "../lib/statement/extra";
import {logErrorHandle, logRequestHandle, logResponseHandle} from '../lib/utils/log4';

const logUtil = {
    logErrorHandle,
    logRequestHandle,
    logResponseHandle
};

export interface LoggerInfo {
    userId: number;
    userName: string;
    ip: string;
    host: string;
    origin: string;
    userAgent: string;
    status: number;
    url: string;
    method: string;
}

export const loggerMiddleware = async (ctx: Context, next: Next): Promise<void> => {
    const {header: {'refresh-token': refresh_token}, request: {method, url, header}} = ctx;
    const {data: userInfo} = await getTokenResult(refresh_token);
    const {host, origin, cip} = header;
    const loggerData: LoggerInfo = {
        userName: userInfo ? userInfo.username : null,
        userId: userInfo ? userInfo.id : null,
        method: method,
        url: url,
        host: host,
        origin: origin,
        userAgent: header['user-agent'],
        ip: cip,
        status: null
    };
    const start = new Date().getTime();
    let ms = new Date().getTime() - start;
    logUtil.logRequestHandle(ctx, 0);
    await next();
    try {
        // 开始进入到下一个中间件
        if (ctx.status === 404) {
            ctx.throw(404);
        }
        ms = new Date().getTime() - start;
        // 记录响应日志
        logUtil.logResponseHandle(ctx, ms);
        loggerData.status = ctx.status;
    } catch (error) {
        ms = new Date().getTime() - start;
        // 记录异常日志
        logUtil.logErrorHandle(ctx, error, ms);
        loggerData.status = 500;
    }
    ExtraStatement.createLogger(loggerData);
};
