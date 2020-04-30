import fs from 'fs';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import Redis from 'ioredis';
import {redisConfig, staticPathConfig, jwtConfig, IUnlessPath} from "../conf";
import {Context, Next} from 'koa';
import {ServerResponse} from '../types/response';

const redis = new Redis(redisConfig);

const privateKey = fs.readFileSync(staticPathConfig.PRIVATE_KEY);
const cert = fs.readFileSync(staticPathConfig.PUBLIC_KEY);

const {jwtUnlessPathList, expiresIn, refreshExpiresIn} = jwtConfig;

export interface UserInfo {
    id: number;
    username: string;
    email: string;
    nick: string;
}

export interface IJwtToken {
    token: string;
    refreshToken: string;
}

export interface IJwtErrorStatus {
    isError: boolean;
    isExpired: boolean;
}

export interface ITokenResult<T = null> {
    data: T;
    error: VerifyErrors;
    errorStatus: IJwtErrorStatus;
}

export const createJwtSingleToken = (userInfo: Partial<UserInfo & {isRefresh: boolean}>, expiresInParams: number = expiresIn): string => {
    return jwt.sign({...userInfo}, privateKey, { expiresIn: expiresInParams, algorithm: 'RS256' });
};

export const getJwtToken = (userInfo: UserInfo): IJwtToken => {
    const {id, email, username} = userInfo;
    const token = createJwtSingleToken(userInfo);
    const refreshToken = createJwtSingleToken({id, email, username, isRefresh: true}, refreshExpiresIn);
    redis.set(refreshToken, token);
    return {token, refreshToken};
};

export const removeJwtToken = (refreshToken: string): void => {
    redis.del(refreshToken);
};

export const getTokenResult = (token: string): ITokenResult<UserInfo> => {
    const tokenResult: ITokenResult<UserInfo> = {
        data: null,
        error: null,
        errorStatus: {
            isError: false,
            isExpired: false
        }
    };
    jwt.verify(token, cert, (err: VerifyErrors, decoded: UserInfo) => {
        if (err) {
            tokenResult.errorStatus.isError = true;
            tokenResult.error = err;
            if (err.name === 'TokenExpiredError') {
                tokenResult.errorStatus.isExpired = true;
            }
        } else {
            tokenResult.data = decoded;
        }
    });
    return tokenResult;
};

const createNewToken = (ctx: Context, data: Partial<UserInfo>, refreshToken: string): void => {
    const newToken = createJwtSingleToken(data);
    ctx.res.setHeader('Access-Control-Expose-Headers','authorization');
    ctx.res.setHeader('authorization', newToken);
    redis.set(refreshToken, newToken);
};

export const verifyTokenErrorCallback = async (ctx: Context, next: Next, token: string, refreshToken: string): Promise<void> => {
    const tokenResult = getTokenResult(token);
    const {error, errorStatus: {isError, isExpired}} = tokenResult;
    if (isError) {
        let response: ServerResponse = {} as ServerResponse;
        if (isExpired) {
            const refreshTokenResult = getTokenResult(refreshToken);
            const {data: {id, email, username}, error: refreshError, errorStatus: {isError: refreshIsError, isExpired: refreshIsExpired}} = refreshTokenResult;
            if (refreshIsError) {
                if (refreshIsExpired) {
                    response = {code: 401, message: refreshError.message, result: null};
                    ctx.body = response;
                    return
                } else {
                    createNewToken(ctx, {id, email, username}, refreshToken);
                    await next();
                }
            } else {
                createNewToken(ctx, {id, email, username}, refreshToken);
                await next();
            }
        } else {
            response = {code: 401, message: error.message, result: null};
            ctx.body = response;
        }
        return
    }
    await next();
};

export const checkTokenMiddleware = async (ctx: Context, next: Next): Promise<void> => {
    const {header, method, url} = ctx;
    //get和options请求
    if (['OPTIONS', 'GET'].includes(method) || jwtUnlessPathList.some((unlessPath: IUnlessPath) => url === unlessPath.url)) {
        await next();
        return
    }
    const token: string = header.authorization;
    const refreshToken: string = header['refresh_token'];
    let response: ServerResponse = {} as ServerResponse;
    if (token && refreshToken) {
        await verifyTokenErrorCallback(ctx, next, token, refreshToken);
        return
    }
    response = {code: 403, message: '登录信息已过期', result: null};
    ctx.body = response;
};
