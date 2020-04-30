import {resolve as r} from 'path';
import * as cros from 'koa2-cors';

const IS_LOCAL: boolean = true;

export interface IDataBaseConfig {
    database: string;
    user: string;
    password: string;
    port: number;
    host: string;
}

export interface IRedisConfig {
    host: string;
    port: number;
}

export interface IStaticPathConfig {
    STATIC_PATH: string;
    PRIVATE_KEY: string;
    PUBLIC_KEY: string;
}

export interface IConfig {
    IS_LOCAL: boolean;
    port: number;
    host?: string;
}

export interface IUnlessPath {
    url: string;
    method: string;
}

export interface IJwtConfig {
    jwtUnlessPathList: IUnlessPath[],
    expiresIn: number;
    refreshExpiresIn: number;
}

export type DatabaseMap = Record<keyof typeof databaseMap, string>;

export const dataBaseConfig: IDataBaseConfig = {
    database: 'own_blog',
    user: 'root',
    password: IS_LOCAL ? 'www5576081' : 'ufrVTJd2ONn#U%t&',
    port: 3306,
    host: 'localhost',
};

export const redisConfig: IRedisConfig = {
    host: 'localhost',
    port: 6379,
};

export const staticPathConfig: IStaticPathConfig = {
    STATIC_PATH: r(__dirname, '../../static'),
    PRIVATE_KEY: r(__dirname, '../../public/private.key'),
    PUBLIC_KEY: r(__dirname, '../../public/public.key')
};

export const globalConfig: IConfig = {
    IS_LOCAL,
    port: 9000,
    host: 'localhost',
};

const crosWhiteList = ['http://localhost:3000', 'http://www.wangjie818.wang:3000'];

export const crosOptions: cros.Options = {
    //允许访问的来源地址
    origin: ctx => {
        const {request, origin: ctxOrigin} = ctx;
        const {origin} = request.header;
        return origin !== ctxOrigin && (IS_LOCAL ? true : crosWhiteList.includes(origin)) ? origin : false;
    },
    //设置预检请求有效期（单位: s）
    maxAge: 60*60,
    //是否允许传输cookie（如果为true需要保证origin为*）
    credentials: false,
    //设置请求支持的类型
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    //请求服务器支持的所有头信息字段
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with', 'cip', 'refresh_token'],
};

export const jwtConfig: IJwtConfig = {
    jwtUnlessPathList: [
        {url: '/user', method: 'post'},
        {url: '/login', method: 'post'},
        {url: '/upload', method: 'post'},
    ],
    expiresIn: 60*60*2,
    refreshExpiresIn: 60*60*24*14
};

export const databaseMap = {
    ARTICLE_TABLE_NAME: 'article_info',
    ARTICLE_COMMENT_TABLE_NAME: 'article_comment',
    ARTICLE_REPLY_TABLE_NAME: 'article_reply',
    USER_TABLE_NAME: 'user_info',
    LOGGER_TABLE_NAME: 'log_info',
    TAG_TABLE_NAME: 'tag_info',
    CATEGORY_TABLE_NAME: 'category_info',
    RECIPE_TABLE_NAME: 'recipe',
    RECIPE_DATE_TABLE_NAME: 'recipe_date',
    MESSAGE: 'message',
    MESSAGE_CONTENT: 'message_content',
    MESSAGE_USER: 'message_user',
    ABOUT_COMMENT_TABLE_NAME: 'about_comment',
    ABOUT_REPLY_TABLE_NAME: 'about_reply',
};



