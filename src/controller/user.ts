import fs from 'fs';
import nodePath from 'path';
import Joi, {number, ValidationResult} from 'joi';
import {Context} from "koa";
import {OkPacket} from 'mysql';
import {JoiSchemaToSwaggerSchema} from '../lib/utils';
import {
    ServerResponse,
    SuccessResponses,
    SqlPageListResponse,
    PageListResponse,
    ServerSuccessResponsePageList
} from '../types/response';
import {LoginRequestParams, UserInfo, SingleUserInfo, UserListRequestBody} from "../types/user";
import {IJwtToken, getJwtToken, removeJwtToken} from '../middleware/verify-token';
import {registerUserSchema, loginSchema, userListSchema, updateUserSchema} from '../lib/schemas/user';
import UserStatement from '../lib/statement/user';
import {
    staticPathConfig,
    STATIC_URL,
} from '../conf';
import {
    request,
    summary,
    body,
    path,
    query,
    tagsAll,
    responses,
    header
} from 'koa-swagger-decorator/dist';

const loginResponses: SuccessResponses<SingleUserInfo & IJwtToken> = {
    200: {
        description: 'success',
        schema: {
            type: 'object',
            properties: {
                code: {type: 'number', example: 0, description: '状态码'},
                message: {type: 'string', example: '成功', description: '提示信息'},
                result: {
                    type: 'object',
                    properties: {
                        id: {type: 'number', example: 'number', description: '用户id'},
                        email: {type: 'string', example: 'string', description: '用户邮箱'},
                        username: {type: 'string', example: 'string', description: '用户名'},
                        profilePicture: {type: 'string', example: 'string', description: '用户头像'},
                        nick: {type: 'string', example: 'string', description: '真实姓名'},
                        createTime: {type: 'string', example: 'string', description: '创建时间'},
                        updateTime: {type: 'string', example: 'string', description: '更新时间'},
                        token: {type: 'string', example: 'string', description: '令牌'},
                        refreshToken: {type: 'string', example: 'string', description: '刷新令牌'},
                    }
                }
            }
        }
    }
};

const userListResponse: ServerSuccessResponsePageList<SingleUserInfo> = {
    200: {
        description: 'success',
        schema: {
            type: 'object',
            properties: {
                code: {type: 'number', example: 0, description: '状态码'},
                message: {type: 'string', example: '成功', description: '提示信息'},
                result: {
                    type: 'object',
                    properties: {
                        items: {
                            type: "array",
                            items: {
                                type: 'object',
                                properties: {
                                    id: {type: 'number', example: 'number', description: '用户id'},
                                    email: {type: 'string', example: 'string', description: '用户邮箱'},
                                    username: {type: 'string', example: 'string', description: '用户名'},
                                    profilePicture: {type: 'string', example: 'string', description: '用户头像'},
                                    nick: {type: 'string', example: 'string', description: '真实姓名'},
                                    createTime: {type: 'string', example: 'string', description: '创建时间'},
                                    updateTime: {type: 'string', example: 'string', description: '更新时间'},
                                }
                            }
                        },
                        total: {type: 'number', example: 'number', description: '用户id'},
                    }
                }
            }
        }
    }
};

@tagsAll(["系统用户API接口"])
export default class User extends JoiSchemaToSwaggerSchema {
    @request('post', '/upload')
    static async uploadFile(ctx: Context): Promise<void> {
        let response = {} as ServerResponse<string>;
        const file = ctx.request.files.file;
        const fileName = `${new Date().getTime()}_${file.name}`;
        const render = fs.createReadStream(file.path);
        const filePath = nodePath.join(staticPathConfig.BASE_PATH, 'static/upload/', fileName);
        const fileDir = nodePath.join(staticPathConfig.BASE_PATH, 'static/upload/');
        if (!fs.existsSync(fileDir)) {
            if (!fs.mkdirSync(fileDir, {recursive: true})) {
                console.log(`文件创建失败`)
            }
        }
        // 创建写入流
        const upStream = fs.createWriteStream(filePath);
        render.pipe(upStream);
        response.result = `${STATIC_URL}${fileName}`;
        response.message = '上传成功';
        ctx.body = response;
    }
    @request('post', '/user')
    @summary('用户注册')
    @body({...User.parseToSwaggerSchema(registerUserSchema)})
    @responses({...User.defaultServerResponse})
    static async registerUser(ctx: Context): Promise<void> {
        const {email, username, password, profilePicture} = ctx.request.body;
        let response = {} as ServerResponse<{ items: SingleUserInfo[], total: number }>;
        const validator = Joi.validate({email, username, password, profilePicture}, registerUserSchema);
        if (validator.error) {
            ctx.body = response = {code: 400, message: validator.error.message, result: null};
            return
        }
        const currentUserByEmail: UserInfo[] = await UserStatement.queryUseExists({account: email, password});
        if (currentUserByEmail && currentUserByEmail.length) {
            ctx.body = response = {code: 400, message: '当前邮箱已被注册', result: null};
            return
        }
        const currentUserByUsername: UserInfo[] = await UserStatement.queryUseExists({account: username, password});
        if (currentUserByUsername && currentUserByUsername.length) {
            ctx.body = response = {code: 400, message: '当前用户名已被注册', result: null};
            return
        }
        const newUser: OkPacket = await UserStatement.registerUser({email, username, password, profilePicture});
        if (newUser && newUser.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('patch', '/user/:id')
    @summary('用户信息更新')
    @header(User.defaultHeaders)
    @path({
        id: {type: number, description: '用户id'}
    })
    @body({...User.parseToSwaggerSchema(updateUserSchema)})
    @responses({
        ...User.defaultServerResponse,
        ...loginResponses
    })
    static async updateUser(ctx: Context): Promise<void> {
        const {params: {id}, request: {body}} = ctx;
        let response = {} as ServerResponse<SingleUserInfo & IJwtToken>;
        const validator = Joi.validate(body, updateUserSchema);
        if (validator.error) {
            ctx.body = response = {code: 400, message: validator.error.message, result: null};
            return
        }
        const {email, username, password, oldPassword, profilePicture} = body;
        const currentUserById: UserInfo[] = await UserStatement.queryUseExists(oldPassword ? {
            account: email,
            password: oldPassword
        } : {account: username, password});
        if (!(currentUserById && currentUserById.length)) {
            ctx.body = response = {code: 400, message: `${oldPassword ? '原' : ''}密码错误`, result: null};
            return
        }
        let updateUserRes: OkPacket = await UserStatement.updateUser(id, {email, username, password, profilePicture});
        if (updateUserRes && updateUserRes.insertId !== void 0) {
            const currentUser: UserInfo[] = await UserStatement.queryUserInfo(id);
            if (currentUser && currentUser.length) {
                const [userInfo,] = currentUser;
                delete userInfo.password;
                response = {code: 0, message: '成功', result: {...userInfo, ...getJwtToken(userInfo)}}
            } else {
                response = {code: 400, message: `当前用户不存在`, result: null};
            }
        } else {
            response = {code: 400, message: `更新用户信息失败`, result: null};
        }
        ctx.body = response;
    }

    @request('post', '/login')
    @summary('用户登录')
    @body({...User.parseToSwaggerSchema(loginSchema)})
    @responses({
        ...User.defaultServerResponse,
        ...loginResponses
    })
    static async login(ctx: Context): Promise<void> {
        const {account, password} = ctx.request.body;
        const validator: ValidationResult<LoginRequestParams> = Joi.validate({account, password}, loginSchema);
        let response = {} as ServerResponse<SingleUserInfo & IJwtToken>;
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const queryResult: UserInfo[] = await UserStatement.queryUseExists({account, password});
        if (queryResult && queryResult.length) {
            const [userInfo] = queryResult;
            delete userInfo.password;
            response = {code: 0, message: '成功', result: {...userInfo, ...getJwtToken(userInfo)}};
        } else {
            response = {...response, code: 400, message: '账号或密码错误'};
        }
        ctx.body = response;
    }

    @request('delete', '/logout')
    @summary('用户退出')
    @header(User.defaultHeaders)
    @responses({...User.defaultServerResponse})
    static async logout(ctx: Context): Promise<void> {
        const {header: {'refresh-token': refresh_token}} = ctx;
        refresh_token && removeJwtToken(refresh_token);
        ctx.body = {code: 0, message: '成功', result: null};
    }

    @request('get', '/user-list')
    @summary('获取用户列表')
    @query({...User.parseToSwaggerSchema(userListSchema)})
    @responses({...User.defaultServerResponse, ...userListResponse})
    static async getUserList(ctx: Context): Promise<void> {
        const {name, limit, offset} = ctx.request.query;
        let response = {} as ServerResponse<PageListResponse<SingleUserInfo>>;
        const validator: ValidationResult<UserListRequestBody> = Joi.validate({name, limit, offset}, userListSchema);
        if (validator.error) {
            ctx.body = response = {code: 400, message: validator.error.message, result: null};
            return
        }
        const queryResult: SqlPageListResponse<UserInfo> = await UserStatement.queryUserList({name, limit, offset});
        if (queryResult && queryResult.length) {
            const [userList, [{total}]] = queryResult;
            response = {
                code: 0,
                message: '成功',
                result: {
                    items: userList.map((user: UserInfo) => {
                        delete user.password;
                        return user
                    }),
                    total: total
                }
            };
        } else {
            response = {...response, code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }
}
