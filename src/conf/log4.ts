/**
 **@Description: log配置文件
 **@Author: Paul Wang
 **@Date: 2020/9/18
 */
import path from 'path';

// 日志根目录
const baseLogPath = path.resolve(__dirname, `../../logs`);

// 错误日志目录
const errorPath = `/error`;
// 错误日志文件名
const errorFileName = `error`;
// 错误日志输出完整路径
const errorLogPath = `${baseLogPath}${errorPath}/${errorFileName}`;

// 请求日志目录
const requestPath = `/request`;
// 请求日志文件名
const requestFileName = `request`;
// 请求日志输出完整路径
const requestLogPath = `${baseLogPath}${requestPath}/${requestFileName}`;

// 响应日志目录
const responsePath = `/response`;
// 响应日志文件名
const responseFileName = `response`;
// 响应日志输出完整路径
const responseLogPath = `${baseLogPath}${responsePath}/${responseFileName}`;


export default {
    appenders: {
        console: {
            type: 'console'
        },
        errorLogger: {
            type: 'dateFile',
            filename: errorLogPath,
            pattern: '.yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            numBackups: 3,
            path: errorPath,
            layout: {
                type: 'basic'
            }
        },
        requestLogger: {
            type: 'dateFile',
            filename: requestLogPath,
            pattern: '.yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            numBackups: 3,
            path: requestPath,
            layout: {
                type: 'basic'
            }
        },
        responseLogger: {
            type: 'dateFile',
            filename: responseLogPath,
            pattern: '.yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            numBackups: 3,
            path: responsePath,
            layout: {
                type: 'basic'
            }
        }
    },
    // 供外部调用的名称和对应设置定义
    categories: {
        default: {
            appenders: ['console'], level: 'all'
        },
        errorLogger: {
            appenders: ['errorLogger'], level: 'error'
        },
        requestLogger: {
            appenders: ['requestLogger'], level: 'info'
        },
        responseLogger: {
            appenders: ['responseLogger'], level: 'info'
        }
    },
    baseLogPath,
    replaceConsole: true
};


