import Joi, {ValidationResult} from 'joi';
import {Context} from "koa";
import {OkPacket} from 'mysql';
import {JoiSchemaToSwaggerSchema, html_decode} from '../lib/utils';
import {
    ServerResponse,
    SuccessResponses,
    SqlPageListResponse,
    PageListResponse,
    ServerSuccessResponsePageList
} from '../types/response';
import {
    ArticleInfo,
    CommentReplyInfo,
    CommentUserInfo,
    CreateArticleRequestBody,
    CommentAndReplyInfo,
    CreateCommentRequestBody,
    CommentReplyBaseInfo
} from "../types/article";
import {getTokenResult} from "../middleware/verify-token";
import {RequestPageBody} from "../types/request";
import {
    articlePageListSchema,
    articlePageListByCategoryIdSchema,
    createArticleSchema,
    createCommentReplySchema,
    createArticleCommentReplySchema
} from '../lib/schemas/article';
import ArticleStatement from '../lib/statement/article';
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
import Extra from "./extra";

const articleAllListResponse: SuccessResponses<ArticleInfo> = {
    200: {
        description: 'success',
        schema: {
            type: 'object',
            properties: {
                code: {type: 'number', example: 0, description: '状态码'},
                message: {type: 'string', example: '成功', description: '提示信息'},
                result: {
                    type: "array",
                    items: {
                        type: 'object',
                        properties: {
                            id: {type: 'number', example: 'number', description: '文章id'},
                            title: {type: 'string', example: 'string', description: '文章标题'},
                            viewCount: {type: 'number', example: 'number', description: '文章阅读数'},
                            tagIds: {type: 'array', items: {type: "string", example: 'string'}, description: '文章标签列表'},
                            categories: {
                                type: 'array',
                                items: {type: "string", example: 'string'},
                                description: '文章目录列表'
                            },
                            content: {type: 'string', example: 'string', description: '文章内容'},
                            userId: {type: 'number', example: 'number', description: '用户id'},
                            username: {type: 'string', example: 'string', description: '用户名'},
                            userProfilePicture: {type: 'string', example: 'string', description: '用户头像'},
                            comments: {type: 'number', example: 'number', description: '文章评论数'},
                            createTime: {type: 'string', example: 'string', description: '创建时间'},
                            updateTime: {type: 'string', example: 'string', description: '更新时间'},
                        }
                    }
                }
            }
        }
    }
};

const articlePageListResponse: ServerSuccessResponsePageList<ArticleInfo> = {
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
                                    id: {type: 'number', example: 'number', description: '文章id'},
                                    title: {type: 'string', example: 'string', description: '文章标题'},
                                    viewCount: {type: 'number', example: 'number', description: '文章阅读数'},
                                    tagIds: {
                                        type: 'array',
                                        items: {type: "string", example: 'string'},
                                        description: '文章标签列表'
                                    },
                                    categories: {
                                        type: 'array',
                                        items: {type: "string", example: 'string'},
                                        description: '文章目录列表'
                                    },
                                    content: {type: 'string', example: 'string', description: '文章内容'},
                                    userId: {type: 'number', example: 'number', description: '用户id'},
                                    username: {type: 'string', example: 'string', description: '用户名'},
                                    userProfilePicture: {type: 'string', example: 'string', description: '用户头像'},
                                    comments: {type: 'number', example: 'number', description: '文章评论数'},
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

const articleDetailResponse: SuccessResponses<ArticleInfo> = {
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
                        id: {type: 'number', example: 'number', description: '文章id'},
                        title: {type: 'string', example: 'string', description: '文章标题'},
                        viewCount: {type: 'number', example: 'number', description: '文章阅读数'},
                        tagIds: {type: 'array', items: {type: "string", example: 'string'}, description: '文章标签列表'},
                        categories: {type: 'array', items: {type: "string", example: 'string'}, description: '文章目录列表'},
                        content: {type: 'string', example: 'string', description: '文章内容'},
                        userId: {type: 'number', example: 'number', description: '用户id'},
                        username: {type: 'string', example: 'string', description: '用户名'},
                        userProfilePicture: {type: 'string', example: 'string', description: '用户头像'},
                        comments: {type: 'number', example: 'number', description: '文章评论数'},
                        createTime: {type: 'string', example: 'string', description: '创建时间'},
                        updateTime: {type: 'string', example: 'string', description: '更新时间'},
                    }
                }
            }
        }
    }
};

const articleCommentListResponse: SuccessResponses<CommentAndReplyInfo> = {
    200: {
        description: 'success',
        schema: {
            type: 'object',
            properties: {
                code: {type: 'number', example: 0, description: '状态码'},
                message: {type: 'string', example: '成功', description: '提示信息'},
                result: {
                    type: "array",
                    items: {
                        type: 'object',
                        properties: {
                            id: {type: 'number', example: 'number', description: '评论id'},
                            articleId: {type: 'number', example: 'number', description: '文章id'},
                            userId: {type: 'number', example: 'number', description: '用户id'},
                            content: {type: 'string', example: 'string', description: '评论内容'},
                            createTime: {type: 'string', example: 'string', description: '创建时间'},
                            userName: {type: 'string', example: 'string', description: '用户名'},
                            userProfilePicture: {type: 'string', example: 'string', description: '用户头像'},
                            reply: {
                                type: 'object',
                                properties: {
                                    id: {type: 'number', example: 'number', description: '回复id'},
                                    replyWay: {
                                        type: 'number',
                                        example: 'number',
                                        description: '回复方式（10: 回复他人评论， 20：回复别人的回复）'
                                    },
                                    replyId: {
                                        type: 'number',
                                        example: 'number',
                                        description: '回复目标id（replyWay为10时为commentId，replyWay为20时为replyId）'
                                    },
                                    commentId: {type: 'number', example: 'number', description: '文章评论id'},
                                    userId: {type: 'number', example: 'number', description: '用户id'},
                                    toUserId: {type: 'number', example: 'number', description: '回复用户id'},
                                    content: {type: 'string', example: 'string', description: '回复内容'},
                                    type: {
                                        type: 'number',
                                        example: 'number',
                                        description: '回复类型（10：点赞，20：踩,  30: 文字回复）'
                                    },
                                    createTime: {type: 'string', example: 'string', description: '创建时间'},
                                    userName: {type: 'string', example: 'string', description: '用户名'},
                                    userProfilePicture: {type: 'string', example: 'string', description: '用户头像'},
                                    toUserName: {type: 'string', example: 'string', description: '回复对象用户名'},
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const formatArticleInfo = async (article: ArticleInfo, needContent: boolean = true): Promise<ArticleInfo> => {
    const {content, tagIds, categories, id} = article;
    const commentList: CommentUserInfo[] = await ArticleStatement.getArticleCommentList(id);
    article.comments = commentList.length;
    article.content = needContent ? html_decode(content) : '';
    article.tagIds = (tagIds as string).split(',').map((item: string): number => Number(item));
    article.categories = (categories as string).split(',').map((item: string): number => Number(item));
    return article;
};

@tagsAll(["文章API接口"])
export default class Article extends JoiSchemaToSwaggerSchema {
    @request('get', '/article/all')
    @summary('获取所有文章')
    @responses({...Article.defaultServerResponse, ...articleAllListResponse})
    static async getArticleAllList(ctx: Context): Promise<void> {
        let response = {} as ServerResponse<ArticleInfo[]>;
        const articleList: ArticleInfo[] = await ArticleStatement.getArticleAllList();
        if (articleList && articleList.length) {
            const processAwaitListFn = async (list: ArticleInfo[]): Promise<void> => {
                for (let article of list) {
                    await formatArticleInfo(article, false);
                }
            };
            await processAwaitListFn(articleList);
            response = {code: 0, message: '成功', result: articleList};
        } else {
            response = {code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/article/page')
    @summary('获取文章分页列表')
    @query({...Article.parseToSwaggerSchema(articlePageListSchema)})
    @responses({...Article.defaultServerResponse, ...articlePageListResponse})
    static async getArticlePageList(ctx: Context): Promise<void> {
        const validator = Joi.validate(ctx.query, articlePageListSchema);
        let response = {} as ServerResponse<PageListResponse<ArticleInfo>>;
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const queryResult: SqlPageListResponse<ArticleInfo> = await ArticleStatement.getArticlePageList(ctx.query);
        if (queryResult && queryResult.length) {
            const [articleList, [{total}]] = queryResult;
            const processAwaitListFn = async (list: ArticleInfo[]): Promise<void> => {
                for (let article of list) {
                    await formatArticleInfo(article);
                }
            };
            await processAwaitListFn(articleList);
            response = {
                code: 0,
                message: '成功',
                result: {
                    items: articleList,
                    total: total
                }
            };
        } else {
            response = {...response, code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/article/page/simple')
    @summary('获取文章简单信息分页列表')
    @query({...Article.parseToSwaggerSchema(articlePageListSchema)})
    @responses({...Article.defaultServerResponse, ...articlePageListResponse})
    static async getArticleSinglePageList(ctx: Context): Promise<void> {
        const validator = Joi.validate(ctx.query, articlePageListSchema);
        let response = {} as ServerResponse<PageListResponse<ArticleInfo>>;
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const queryResult: SqlPageListResponse<ArticleInfo> = await ArticleStatement.getArticlePageList(ctx.query);
        if (queryResult && queryResult.length) {
            const [articleList, [{total}]] = queryResult;
            articleList.forEach((article: ArticleInfo) => {
                article.content = '';
            });
            response = {
                code: 0,
                message: '成功',
                result: {
                    items: articleList,
                    total: total
                }
            };
        } else {
            response = {...response, code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/article/:id')
    @summary('获取文章详细信息')
    @path({
        id: {type: 'number', description: '文章id'}
    })
    @responses({...Article.defaultServerResponse, ...articleDetailResponse})
    static async getArticleDetailById(ctx: Context): Promise<void> {
        const {id} = ctx.params;
        let response = {} as ServerResponse<ArticleInfo>;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '当前文章id不存在（id为空）', result: null};
            return
        }
        const queryResult: ArticleInfo[] = await ArticleStatement.getArticleById(id);
        if (queryResult && queryResult.length) {
            const [articleInfo] = queryResult;
            await formatArticleInfo(articleInfo);
            response = {
                code: 0,
                message: '成功',
                result: articleInfo
            };
        } else {
            response = {...response, code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/article/category/:id')
    @summary('根据目录id获取文章分页列表')
    @path({
        id: {type: 'number', description: '目录id'}
    })
    @query({...Article.parseToSwaggerSchema(articlePageListByCategoryIdSchema)})
    @responses({...Article.defaultServerResponse, ...articlePageListResponse})
    static async getArticlePageListByCategoryId(ctx: Context): Promise<void> {
        const {id} = ctx.params;
        let response = {} as ServerResponse<PageListResponse<ArticleInfo>>;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '当前目录不存在（id为空）', result: null};
            return
        }
        const validator: ValidationResult<RequestPageBody> = Joi.validate(ctx.query, articlePageListByCategoryIdSchema);
        if (validator.error) {
            ctx.body = response = {code: 400, message: validator.error.message, result: null};
            return
        }
        const queryResult: SqlPageListResponse<ArticleInfo> = await ArticleStatement.getArticlePageListByCategoryId({
            ...ctx.query,
            categoryId: id
        });
        if (queryResult && queryResult.length) {
            const [articleList, [{total}]] = queryResult;
            const processAwaitListFn = async (list: ArticleInfo[]): Promise<void> => {
                for (let article of list) {
                    await formatArticleInfo(article);
                }
            };
            await processAwaitListFn(articleList);
            response = {
                code: 0,
                message: '成功',
                result: {
                    items: articleList,
                    total: total
                }
            };
        } else {
            response = {...response, code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/article/tag/:id')
    @summary('根据标签录id获取文章分页列表')
    @path({
        id: {type: 'number', description: '目录id'}
    })
    @query({...Article.parseToSwaggerSchema(articlePageListByCategoryIdSchema)})
    @responses({...Article.defaultServerResponse, ...articlePageListResponse})
    static async getArticlePageListByTagId(ctx: Context): Promise<void> {
        const {id} = ctx.params;
        let response = {} as ServerResponse<PageListResponse<ArticleInfo>>;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '当前标签不存在（id为空）', result: null};
            return
        }
        const validator: ValidationResult<RequestPageBody> = Joi.validate(ctx.query, articlePageListByCategoryIdSchema);
        if (validator.error) {
            ctx.body = response = {code: 400, message: validator.error.message, result: null};
            return
        }
        const queryResult: SqlPageListResponse<ArticleInfo> = await ArticleStatement.getArticlePageListByTagIdId({
            ...ctx.query,
            tagId: id
        });
        if (queryResult && queryResult.length) {
            const [articleList, [{total}]] = queryResult;
            const processAwaitListFn = async (list: ArticleInfo[]): Promise<void> => {
                for (let article of list) {
                    await formatArticleInfo(article);
                }
            };
            await processAwaitListFn(articleList);
            response = {
                code: 0,
                message: '成功',
                result: {
                    items: articleList,
                    total: total
                }
            };
        } else {
            response = {...response, code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('post', '/article')
    @summary('创建文章')
    @header(Article.defaultHeaders)
    @body({...Article.parseToSwaggerSchema(createArticleSchema)})
    @responses({...Article.defaultServerResponse})
    static async createArticle(ctx: Context): Promise<void> {
        const {header: {'refresh-token': refresh_token}, request: {body}} = ctx;
        const {data: userInfo} = await getTokenResult(refresh_token);
        let response = {} as ServerResponse;
        if (!userInfo) {
            ctx.body = response = {...response, code: 400, message: '用户未登录', result: null};
            return
        }
        let {categories, content, tagIds, title} = body;
        categories = categories.toString();
        tagIds = tagIds.toString();
        const validator: ValidationResult<CreateArticleRequestBody> = Joi.validate({
            categories,
            content,
            tagIds,
            title
        }, createArticleSchema);
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const newArticle: OkPacket = await ArticleStatement.createArticle({...body, userId: userInfo.id});
        if (newArticle && newArticle.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('patch', '/article/:id')
    @header(Article.defaultHeaders)
    @summary('编辑文章')
    @body({...Article.parseToSwaggerSchema(createArticleSchema)})
    @responses({...Article.defaultServerResponse})
    static async editArticle(ctx: Context): Promise<void> {
        const {params: {id}, header: {'refresh-token': refresh_token}, request: {body}} = ctx;
        let response = {} as ServerResponse;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '文章id不存在', result: null};
            return
        }
        const [currentArticle,] = await ArticleStatement.getArticleById(id);
        const {data: userInfo} = getTokenResult(refresh_token);
        if (currentArticle.userId !== userInfo.id) {
            ctx.body = response = {code: 400, message: '不能编辑他人创建文章', result: null};
            return
        }
        let {categories, content, tagIds, title} = body;
        categories = categories.toString();
        tagIds = tagIds.toString();
        const validator: ValidationResult<CreateArticleRequestBody> = Joi.validate({
            categories,
            content,
            tagIds,
            title
        }, createArticleSchema);
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const editArticle: OkPacket = await ArticleStatement.editArticle(id, {categories, content, tagIds, title});
        if (editArticle && editArticle.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('delete', '/article/:id')
    @summary('删除文章')
    @header(Article.defaultHeaders)
    @path({
        id: {type: 'number', description: '文章id'}
    })
    @responses({...Article.defaultServerResponse})
    static async deleteArticle(ctx: Context): Promise<void> {
        const {params: {id}, header: {'refresh-token': refresh_token}} = ctx;
        let response = {} as ServerResponse;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '文章id不存在', result: null};
            return
        }
        const [currentArticle,] = await ArticleStatement.getArticleById(id);
        const {data: userInfo} = getTokenResult(refresh_token);
        if (currentArticle.userId !== userInfo.id) {
            ctx.body = response = {code: 400, message: '不能删除他人创建文章', result: null};
            return
        }
        const queryResult: OkPacket = await ArticleStatement.deleteArticle(id);
        if (queryResult && queryResult.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/article/comment/:id')
    @summary('获取文章评论列表')
    @path({
        id: {type: 'number', description: '文章id'}
    })
    @responses({...Article.defaultServerResponse, ...articleCommentListResponse})
    static async getArticleCommentList(ctx: Context): Promise<void> {
        const {params: {id}} = ctx;
        let response = {} as ServerResponse<CommentAndReplyInfo[]>;
        const commentList: CommentAndReplyInfo[] = await ArticleStatement.getArticleCommentList(id);
        if (commentList && commentList.length) {
            const processAwaitListFn = async (list: CommentAndReplyInfo[]): Promise<void> => {
                for (let comment of list) {
                    const {id} = comment;
                    //回复类型（10：点赞，20：踩,  30: 文字回复）
                    const replyAllList: CommentReplyInfo[] = await ArticleStatement.getArticleCommentReplyListByCommentId(id);
                    let [likes, dislikes, replyList, replyToReplyList]: [number, number, CommentReplyInfo[], CommentReplyInfo[]] = [0, 0, [], []];
                    replyAllList.forEach((reply: CommentReplyInfo) => {
                        if (reply.type === 30) {
                            replyList.push({...reply, likes: 0, dislikes: 0});
                        } else {
                            if (reply.replyWay === 10) {
                                reply.type === 10 ? likes++ : dislikes++
                            } else {
                                replyToReplyList.push(Object.assign({}, reply, {likes: 0, dislikes: 0}));
                            }
                        }
                    });
                    replyList = replyList.map((reply: CommentReplyInfo) => {
                        let likes = 0, dislikes = 0;
                        replyToReplyList.forEach((item: CommentReplyInfo) => {
                            if (item.replyId === reply.id) {
                                if (item.type === 10) {
                                    likes++;
                                } else {
                                    dislikes++;
                                }
                            }
                        });
                        return Object.assign({}, reply, {likes, dislikes})
                    });
                    comment.reply = {likes, dislikes, replyList};
                }
            };
            await processAwaitListFn(commentList);
            response = {code: 0, message: '成功', result: commentList};
        } else {
            response = {code: 404, message: '资源不存在', result: null}
        }
        ctx.body = response;
    }

    @request('post', '/article/comment/:id')
    @summary('新增文章评论')
    @header(Article.defaultHeaders)
    @path({
        id: {type: 'number', description: '文章id'}
    })
    @body({...Article.parseToSwaggerSchema(createCommentReplySchema)})
    @responses({...Article.defaultServerResponse})
    async createArticleComment(ctx: Context): Promise<void> {
        const {params: {id}, header: {'refresh-token': refresh_token}, request: {body}} = ctx;
        let response = {} as ServerResponse;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '文章id不存在', result: null};
            return
        }
        const {data: userInfo} = getTokenResult(refresh_token);
        if (!userInfo) {
            ctx.body = response = {code: 400, message: '请登录后评论', result: null};
            return
        }
        const {content} = body;
        const validator: ValidationResult<CreateCommentRequestBody> = Joi.validate({content}, createCommentReplySchema);
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        let articleComment: OkPacket = await ArticleStatement.createArticleComment(id, {userId: userInfo.id, content});
        if (articleComment && articleComment.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
            const articleResult: ArticleInfo[] = await ArticleStatement.getArticleById(id);
            if (articleResult && articleResult.length) {
                const [articleDetail] = articleResult;
                const {userId: recId, title} = articleDetail;
                Extra.createNotice({sendId: userInfo.id, recId, content, title, type: 10, sourceId: id});
            }
        }
        ctx.body = response;
    }

    @request('delete', '/article/comment/:id')
    @summary('删除文章评论')
    @header(Article.defaultHeaders)
    @path({
        id: {type: 'number', description: '评论id'}
    })
    @responses({...Article.defaultServerResponse})
    async deleteArticleComment(ctx: Context): Promise<void> {
        const {params: {id}} = ctx;
        let response = {} as ServerResponse;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '评论id不存在', result: null};
            return
        }
        const queryResult: OkPacket = await ArticleStatement.deleteArticleComment(id);
        if (queryResult && queryResult.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('post', '/article/reply/:id')
    @summary('新增文章评论回复')
    @header(Article.defaultHeaders)
    @path({
        id: {type: 'number', description: '评论id'}
    })
    @body({...Article.parseToSwaggerSchema(createArticleCommentReplySchema)})
    @responses({...Article.defaultServerResponse})
    async createArticleCommentReply(ctx: Context): Promise<void> {
        const {params: {id: commentId}, header: {'refresh-token': refresh_token}, request: {body}} = ctx;
        let response = {} as ServerResponse;
        const {data: userInfo} = getTokenResult(refresh_token);
        if (!userInfo) {
            ctx.body = response = {code: 400, message: '请登录后回复', result: null};
            return
        }
        const {id: userId} = userInfo;
        const {articleId, type, content, toUserId, replyWay, replyId} = body;
        const requestBody = {
            commentId,
            type,
            content,
            toUserId,
            userId,
            replyWay,
            replyId: replyWay === 10 ? commentId : replyId
        };
        const validator = Joi.validate(requestBody, createArticleCommentReplySchema);
        if (validator.error) {
            ctx.body = response = {code: 400, message: validator.error.message, result: null};
            return
        }
        if (toUserId === userId) {
            ctx.body = response = {
                code: 400,
                message: `当前未开放自己为自己${type === 10 ? '点赞' : type === 30 ? '评论' : '踩'}功能!`,
                result: null
            };
            return
        }
        const replyList: CommentReplyBaseInfo[] = await ArticleStatement.getArticleCommentReplyListByReplyWayAndReplyId(replyWay, replyWay === 10 ? commentId : replyId);
        let queryResult: OkPacket = {} as OkPacket;
        if ([10, 20].includes(type)) {
            let replyIndex = replyList.findIndex(item => item.userId === userId && item.type === type);
            queryResult = replyIndex > -1 ? await ArticleStatement.deleteArticleCommentReplyByReplyId(replyList[replyIndex].id, false) : await ArticleStatement.createArticleCommentReply(commentId, requestBody);
        } else {
            queryResult = await ArticleStatement.createArticleCommentReply(commentId, requestBody);
        }
        if (queryResult && queryResult.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
            const articleResult: ArticleInfo[] = await ArticleStatement.getArticleById(articleId);
            if (articleResult && articleResult.length) {
                const [articleDetail] = articleResult;
                const {title} = articleDetail;
                if (userId !== toUserId) {
                    Extra.createNotice({sendId: userId, recId: toUserId, content, title, type: type === 10 ? 30 : type === 30 ?  20 : 40, sourceId: articleId});
                }
            }
        }
        ctx.body = response;
    }

    @request('delete', '/article/reply/:id')
    @summary('删除评论回复')
    @header(Article.defaultHeaders)
    @path({
        id: {type: 'number', description: '评论id'}
    })
    @responses({...Article.defaultServerResponse})
    async deleteArticleCommentReply(ctx: Context): Promise<void> {
        const {params: {id}} = ctx;
        let response = {} as ServerResponse;
        if (!id) {
            ctx.body = response = {code: 400, message: '回复id不存在', result: null};
            return
        }
        console.log(id, 123,)
        let queryResult = await ArticleStatement.deleteArticleCommentReplyByReplyId(id);
        if (queryResult && queryResult.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }
}
