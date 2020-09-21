import Joi from 'joi';
import {SchemaObject} from '../../types/schema';
import {WebPerformanceRequestParams} from "../../types/monitor";

const createMonitorWebPerformanceSchemaObj: SchemaObject<WebPerformanceRequestParams> = {
    fpt: Joi.number().description('白屏时间'),
    tti: Joi.number().description('首次可交互时间'),
    ready: Joi.number().description('HTML加载完成时间'),
    loadTime: Joi.number().description('页面完全加载时间'),
    firstbyte: Joi.number().description('首包时间'),
    compressionRatio: Joi.number().description('压缩比例'),
    type: Joi.string().description('页面打开方式'),
    dns: Joi.number().description('DNS查询耗时'),
    tcp: Joi.number().description('TCP连接耗时'),
    ttfb: Joi.number().description('请求响应耗时'),
    trans: Joi.number().description('内容传输耗时'),
    dom: Joi.number().description('DOM解析耗时'),
    res: Joi.number().description('资源加载耗时'),
    sslTime: Joi.number().description('SSL安全连接耗时'),
    url: Joi.string().description('页面Url'),
    userAgent: Joi.string().description('设备信息'),
    ip: Joi.string().description('用户ip'),
};
export const createMonitorWebPerformanceSchema = Joi.object().keys(createMonitorWebPerformanceSchemaObj);
