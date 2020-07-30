import Joi from 'joi';
import {SchemaObject} from '../../types/schema';
import {ExtraAboutCommentRequestBody, ExtraAboutCommentReplyRequestBody, ExtraReadMessageRequestBody} from "../../types/extra";

const createExtraAboutCommentSchemaObj: SchemaObject<ExtraAboutCommentRequestBody> = {
    content: Joi.string().description('留言内容').required().error(new Error('留言内容不能为空')),
};
export const createExtraAboutCommentSchema = Joi.object().keys(createExtraAboutCommentSchemaObj);

const createExtraAboutCommentReplySchemaObj: SchemaObject<ExtraAboutCommentReplyRequestBody> = {
    replyType: Joi.number().required().error(new Error('留言回复类型不能为空!')),
    sendId: Joi.number().description('接收人id').required().error(new Error('接收人id不能为空')),
    content: Joi.string().description('留言回复内容').required().error(new Error('留言回复内容不能为空')),
    commentId: Joi.number().description('留言id').required().error(new Error('留言id不能为空')),
    replyId: Joi.number().description('留言回复id').allow(null).when('replyType', {is: 20, then: Joi.number().required().error(new Error('留言回复id不能为空'))}),
};

export const createExtraAboutCommentReplySchema = Joi.object().keys(createExtraAboutCommentReplySchemaObj);


const readMessageSchemaObj: SchemaObject<ExtraReadMessageRequestBody> = {
    messageId: Joi.number().required().error(new Error('消息id不存在')),
};

export const readMessageSchema = Joi.object().keys(readMessageSchemaObj);
