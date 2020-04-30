import Joi from 'joi';
import {LoginRequestParams, UserListRequestBody, RegisterUserRequestBody} from "../../types/user";
import {SchemaObject} from '../../types/schema';

const loginSchemaObj: SchemaObject<LoginRequestParams> = {
    account: Joi.string().description('用户名').required().error(new Error('账号或密码不能为空')),
    password: Joi.string().description('密码').required().error(new Error('账号或密码不能为空')),
};
export const loginSchema = Joi.object().keys(loginSchemaObj);

const userListSchemaObj: SchemaObject<UserListRequestBody> = {
    name: Joi.string().description('用户名').allow(''),
    limit: Joi.number().description('一页显示记录数').required().error(new Error('limit不能为空')),
    offset: Joi.number().description('偏移量即起始记录下标').required().error(new Error('offset不能为空'))
};
export const userListSchema = Joi.object().keys(userListSchemaObj);

const registerUserSchemaObj: SchemaObject<RegisterUserRequestBody> = {
    email: Joi.string().description('邮箱').required().error(new Error('邮箱不能为空')).email().error(new Error('邮箱格式不正确')),
    username: Joi.string().description('用户名').required().error(new Error('用户名不能为空')),
    password: Joi.string().description('密码').required().error(new Error('密码不能为空')).regex(/^[a-zA-Z0-9]{3,30}$/).error(new Error('密码必须为3-30位字母数字组合')),
    profilePicture: Joi.string().description('用户头像url').allow('' || null)
};
export const registerUserSchema = Joi.object().keys(registerUserSchemaObj);

const updateUserSchemaObj: SchemaObject<RegisterUserRequestBody & { oldPassword: string }> = {
    ...registerUserSchemaObj,
    oldPassword: Joi.string().description('原始密码'),
};
export const updateUserSchema = Joi.object().keys(updateUserSchemaObj);

