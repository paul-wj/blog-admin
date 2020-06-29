import koaLogger from 'koa-logger';
import { getTokenResult } from "./verify-token";
import { Context, Next } from "koa";
import { formatDate } from "../lib/utils";
import ExtraStatement from "../lib/statement/extra";

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
    return koaLogger((str: string, args: any) => {
        console.log(str, `time:${formatDate(new Date())}`, `ip:${cip}`);
        let status = args[3];
        if (status) {
            loggerData.status = status;
            ExtraStatement.createLogger(loggerData);
        }
    })(ctx, next)
};
