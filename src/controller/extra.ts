import Joi, {ValidationResult} from 'joi';
import {Context} from "koa";
import {OkPacket} from 'mysql';
import {JoiSchemaToSwaggerSchema} from '../lib/utils';
import dayJs from 'dayjs';
import {
    ServerResponse,
    SuccessResponses,
} from '../types/response';
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
import ExtraStatement from "../lib/statement/extra";
import {
    ExtraAboutCommentInfo,
    ExtraAboutCommentRequestBody,
    ExtraAboutCommentReplyRequestBody,
    ExtraStatisticsInfo,
    ExtraStatisticsTotalInfo
} from "../types/extra";
import {getTokenResult} from "../middleware/verify-token";
import {createExtraAboutCommentReplySchema, createExtraAboutCommentSchema} from "../lib/schemas/extra";
import ArticleStatement from "../lib/statement/article";
import {ArticleInfo, CommentInfo, CommentReplyStatementInfo} from "../types/article";

const getStatisticsInfo = (list: ArticleInfo[] | CommentInfo[] | CommentReplyStatementInfo[]): ExtraStatisticsTotalInfo => {
    const totalObj: ExtraStatisticsTotalInfo = {
        lastDayTotal: 0,
        dayTotal: 0,
        lastWeekTotal: 0,
        weekTotal: 0
    };
    list.forEach((current: ArticleInfo | CommentInfo | CommentReplyStatementInfo) => {
        if (dayJs(current.createTime).isSame(dayJs().subtract(1, 'day'), 'day')) {
            totalObj.lastDayTotal++;
        }
        if (dayJs(current.createTime).isSame(dayJs(), 'day')) {
            totalObj.dayTotal++;
        }
        if (dayJs(current.createTime).isSame(dayJs().day(-6), 'day') || dayJs(current.createTime).isSame(dayJs().day(0), 'day') || (dayJs(current.createTime).isAfter(dayJs().day(-6)) && dayJs(current.createTime).isBefore(dayJs().day(0)))) {
            totalObj.lastWeekTotal++;
        }
        if (dayJs(current.createTime).isSame(dayJs().day(1), 'day') || dayJs(current.createTime).isSame(dayJs().day(7), 'day') || (dayJs(current.createTime).isAfter(dayJs().day(1)) && dayJs(current.createTime).isBefore(dayJs().day(7)))) {
            totalObj.weekTotal++;
        }
    });
    return totalObj;
};

const extraAboutCommentListResponse: SuccessResponses<ExtraAboutCommentInfo> = {
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
                            id: {type: 'number', example: 'number', description: '留言id'},
                            userId: {type: 'number', example: 'number', description: '用户id'},
                            content: {type: 'string', example: 'string', description: '留言内容'},
                            createTime: {type: 'string', example: 'string', description: '创建时间'},
                            userName: {type: 'string', example: 'string', description: '用户名'},
                            userPic: {type: 'string', example: 'string', description: '用户头像'},
                            replyList: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: {type: 'number', example: 'number', description: '留言回复内容id'},
                                        replyType: {type: 'number', example: 'number', description: '留言回复类型（10: 回复评论， 20：回复评论回复）'},
                                        commentId: {type: 'number', example: 'number', description: '留言id'},
                                        replyId: {type: 'number', example: 'number', description: '留言回复id'},
                                        userId: {type: 'number', example: 'number', description: '用户id'},
                                        sendId: {type: 'number', example: 'number', description: '接收人id'},
                                        content: {type: 'string', example: 'string', description: '回复内容'},
                                        type: {type: 'number', example: 'number', description: '留言回复方式（10：点赞，20：踩,  30: 文字回复）'},
                                        createTime: {type: 'string', example: 'string', description: '创建时间'},
                                        commentContent: {type: 'string', example: 'string', description: '留言内容'},
                                        userName: {type: 'string', example: 'string', description: '用户名'},
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const extraStatisticsResponse: SuccessResponses<ExtraStatisticsInfo> = {
    200: {
        description: 'success',
        schema: {
            type: 'object',
            properties: {
                code: {type: 'number', example: 0, description: '状态码'},
                message: {type: 'string', example: '成功', description: '提示信息'},
                result: {
                    type: "object",
                    properties: {
                        total: {type: 'number', example: 'number', description: '总数'},
                        dayTotal: {type: 'number', example: 'number', description: '当日总数'},
                        weekTotal: {type: 'number', example: 'number', description: '当周总数'},
                        weekRingRatio: {type: 'number', example: 'number', description: '周同比'},
                        dayRingRatio: {type: 'number', example: 'number', description: '日同比'},
                    }
                }
            }
        }
    }
};

@tagsAll(["系统附加信息API接口"])
export default class Extra extends JoiSchemaToSwaggerSchema {
    @request('get', '/extra/about/comment')
    @summary('留言列表')
    @responses({...Extra.defaultServerResponse, ...extraAboutCommentListResponse})
    static async getExtraAboutComment(ctx: Context): Promise<void> {
        let response = {} as ServerResponse<ExtraAboutCommentInfo[]>;
        const commentList: ExtraAboutCommentInfo[] = await ExtraStatement.getAboutCommentList();
        if (commentList && commentList.length) {
            const processAwaitListFn = async (list: ExtraAboutCommentInfo[]): Promise<void> => {
                for (let comment of list) {
                    comment.replyList = await ExtraStatement.getAboutCommentReplyList(comment.id);
                }
            };
            await processAwaitListFn(commentList);
            response = {code: 0, message: '成功', result: commentList};
        } else {
            response = {code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('post', '/extra/about/comment')
    @summary('新增留言')
    @header(Extra.defaultHeaders)
    @body({...Extra.parseToSwaggerSchema(createExtraAboutCommentSchema)})
    @responses({...Extra.defaultServerResponse})
    static async createExtraAboutComment(ctx: Context): Promise<void> {
        const {header: {refresh_token}, request: {body}} = ctx;
        const {data: userInfo} = await getTokenResult(refresh_token);
        let response = {} as ServerResponse;
        if (!userInfo) {
            ctx.body = response = {...response, code: 400, message: '用户未登录', result: null};
            return
        }
        const {content} = body;
        const validator: ValidationResult<ExtraAboutCommentRequestBody> = Joi.validate({content}, createExtraAboutCommentSchema);
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const newAboutComment: OkPacket = await ExtraStatement.createAboutComment({content, userId: userInfo.id});
        if (newAboutComment && newAboutComment.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('post', '/extra/about/reply')
    @summary('新增留言回复')
    @header(Extra.defaultHeaders)
    @body({...Extra.parseToSwaggerSchema(createExtraAboutCommentReplySchema)})
    @responses({...Extra.defaultServerResponse})
    static async createExtraAboutCommentReply(ctx: Context): Promise<void> {
        const {header: {refresh_token}, request: {body}} = ctx;
        const {data: userInfo} = await getTokenResult(refresh_token);
        let response = {} as ServerResponse;
        if (!userInfo) {
            ctx.body = response = {...response, code: 400, message: '用户未登录', result: null};
            return
        }
        const {id: userId} = userInfo;
        const {replyType, sendId, commentId, replyId, content} = body;
        const params = {replyType, sendId, commentId, replyId, content};
        const validator: ValidationResult<ExtraAboutCommentReplyRequestBody> = Joi.validate(params, createExtraAboutCommentReplySchema);
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const newAboutReply: OkPacket = replyType === 10 ? await ExtraStatement.createAboutCommentReply({userId, ...params}) : await ExtraStatement.createAboutCommentReplyToReply({userId, ...params});
        if (newAboutReply && newAboutReply.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/extra/statistics/article')
    @summary('获取文章数量数据统计')
    @responses({...Extra.defaultServerResponse, ...extraStatisticsResponse})
    static async getStatisticsForArticle(ctx: Context) {
        let response = {} as ServerResponse<ExtraStatisticsInfo>;
        let articleStatistics: ExtraStatisticsInfo = {
            total: 0,
            dayTotal: 0,
            weekTotal: 0,
            weekRingRatio: 0,
            dayRingRatio: 0,
        };
        const articleAllList: ArticleInfo[] = await ArticleStatement.getArticleAllList();
        if (articleAllList && articleAllList.length) {
            const {lastDayTotal, dayTotal, lastWeekTotal, weekTotal} = getStatisticsInfo(articleAllList);
            articleStatistics = {
                total: articleAllList.length,
                dayTotal,
                dayRingRatio: (dayTotal && lastDayTotal) ? Number(((dayTotal - lastDayTotal) / lastDayTotal).toFixed(2)) : 0,
                weekTotal,
                weekRingRatio: (lastWeekTotal && weekTotal) ? Number(((weekTotal - lastWeekTotal) / weekTotal).toFixed(2)) : 0
            }
        }
        ctx.body = response = {code: 0, result: articleStatistics, message: '成功'};
    }

    @request('get', '/extra/statistics/comment')
    @summary('获取文章评论数量数据统计')
    @responses({...Extra.defaultServerResponse, ...extraStatisticsResponse})
    static async getStatisticsForComment(ctx: Context) {
        let response = {} as ServerResponse<ExtraStatisticsInfo>;
        let articleStatistics: ExtraStatisticsInfo = {
            total: 0,
            dayTotal: 0,
            weekTotal: 0,
            weekRingRatio: 0,
            dayRingRatio: 0,
        };
        const articleCommentAllList: CommentInfo[] = await ArticleStatement.getArticleCommentAllList();
        if (articleCommentAllList && articleCommentAllList.length) {
            const {lastDayTotal, dayTotal, lastWeekTotal, weekTotal} = getStatisticsInfo(articleCommentAllList);
            articleStatistics = {
                total: articleCommentAllList.length,
                dayTotal,
                dayRingRatio: (dayTotal && lastDayTotal) ? Number(((dayTotal - lastDayTotal) / lastDayTotal).toFixed(2)) : 0,
                weekTotal,
                weekRingRatio: (lastWeekTotal && weekTotal) ? Number(((weekTotal - lastWeekTotal) / weekTotal).toFixed(2)) : 0
            }
        }
        ctx.body = response = {code: 0, result: articleStatistics, message: '成功'};
    }

    @request('get', '/extra/statistics/reply')
    @summary('获取文章评论回复数量数据统计')
    @responses({...Extra.defaultServerResponse, ...extraStatisticsResponse})
    static async getStatisticsForReply(ctx: Context) {
        let response = {} as ServerResponse<ExtraStatisticsInfo>;
        let articleStatistics: ExtraStatisticsInfo = {
            total: 0,
            dayTotal: 0,
            weekTotal: 0,
            weekRingRatio: 0,
            dayRingRatio: 0,
        };
        const articleCommentReplyAllList: CommentReplyStatementInfo[] = await ArticleStatement.getArticleCommentAllReplyList();
        if (articleCommentReplyAllList && articleCommentReplyAllList.length) {
            const {lastDayTotal, dayTotal, lastWeekTotal, weekTotal} = getStatisticsInfo(articleCommentReplyAllList);
            articleStatistics = {
                total: articleCommentReplyAllList.length,
                dayTotal,
                dayRingRatio: (dayTotal && lastDayTotal) ? Number(((dayTotal - lastDayTotal) / lastDayTotal).toFixed(2)) : 0,
                weekTotal,
                weekRingRatio: (lastWeekTotal && weekTotal) ? Number(((weekTotal - lastWeekTotal) / weekTotal).toFixed(2)) : 0
            }
        }
        ctx.body = response = {code: 0, result: articleStatistics, message: '成功'};
    }
}
