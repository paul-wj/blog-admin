import Joi from 'joi';
import {
    ArticlePageListRequestBody,
    CreateArticleRequestBody,
    CreateCommentRequestBody,
    CreateArticleCommentReplyRequestBody
} from "../../types/article";
import {RequestPageBody} from "../../types/request";
import {SchemaObject} from '../../types/schema';

const articlePageListSchemaObj: SchemaObject<ArticlePageListRequestBody> = {
    title: Joi.string().description('文章标题'),
    limit: Joi.number().description('一页显示记录数').required().error(new Error('limit不能为空')),
    offset: Joi.number().description('偏移量即起始记录下标').required().error(new Error('offset不能为空'))
};
export const articlePageListSchema = Joi.object().keys(articlePageListSchemaObj);

const articlePageListByCategoryIdSchemaObj: SchemaObject<RequestPageBody> = {
    limit: Joi.number().description('一页显示记录数').required().error(new Error('limit不能为空')),
    offset: Joi.number().description('偏移量即起始记录下标').required().error(new Error('offset不能为空'))
};

export const articlePageListByCategoryIdSchema = Joi.object().keys(articlePageListByCategoryIdSchemaObj);

const createArticleSchemaObj: SchemaObject<CreateArticleRequestBody> = {
    title: Joi.string().description('文章标题').required().error(new Error('标题不能为空')),
    content: Joi.string().description('文章内容').required().error(new Error('文章内容不能为空')),
    categories: Joi.string().description('文章目录'),
    tagIds: Joi.string().description('文章标签'),
};
export const createArticleSchema = Joi.object().keys(createArticleSchemaObj);

const createCommentReplySchemaObj: SchemaObject<CreateCommentRequestBody> = {
    content: Joi.string().description('评论内容').required().error(new Error('评论内容不能为空')),
};
export const createCommentReplySchema = Joi.object().keys(createCommentReplySchemaObj);

const createArticleCommentReplySchemaObj: SchemaObject<CreateArticleCommentReplyRequestBody> = {
    commentId: Joi.string().description('评论id').required().error(new Error('commentId不能为空')),
    replyWay: Joi.number().description('回复方式').required().error(new Error('回复方式不能为空')),
    replyId: Joi.number().description('回复id').when('replyWay', {
        is: 20,
        then: Joi.number().required().error(new Error('回复id不能为空'))
    }),
    type: Joi.number().description('回复类型').required().error(new Error('回复类型不能为空')),
    userId: Joi.number().description('用户id').required(),
    toUserId: Joi.number().description('回复用户id').required().error(new Error('回复用户id不能为空')),
    content: Joi.string().description('回复内容').when('type', {is: 30, then: Joi.string().required().error(new Error('回复内容不能为空'))})
};

export const createArticleCommentReplySchema = Joi.object().keys(createArticleCommentReplySchemaObj);
