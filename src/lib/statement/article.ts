import {query, formatDate} from '../utils';
import {databaseMap, DatabaseMap} from "../../conf";
import {
    ArticleInfo,
    ArticlePageListRequestBody,
    CommentUserInfo,
    CreateArticleRequestBody,
    CommentReplyInfo,
    CreateCommentRequestBody,
    CreateArticleCommentReplyRequestBody,
    CommentReplyBaseInfo,
    CommentInfo,
    CommentReplyStatementInfo
} from "../../types/article";
import {RequestPageBody} from "../../types/request";
import {html_encode} from "../utils";
import {SqlPageListResponse} from "../../types/response";
import {OkPacket} from "mysql";

const {ARTICLE_TABLE_NAME, ARTICLE_COMMENT_TABLE_NAME, USER_TABLE_NAME, ARTICLE_REPLY_TABLE_NAME} = (databaseMap as DatabaseMap);

export default class ArticleStatement {
    static async getArticleAllList() {
        return query<ArticleInfo[]>(`select * from ${ARTICLE_TABLE_NAME} order by createTime desc`);
    }

    static async getArticleCommentList<T = CommentUserInfo[]>(id: number) {
        return query<T>(`
        SELECT
            ARTICLE.*,
            USER.username userName,
            USER.profilePicture userProfilePicture 
        FROM
            article_comment ARTICLE
            LEFT JOIN user_info USER ON ARTICLE.userId = USER.id 
        WHERE
            ARTICLE.articleId=${id} order by createTime desc
        `)
    }

    static async getArticlePageList(params: ArticlePageListRequestBody) {
        const {limit, offset, title} = params;
        return query<SqlPageListResponse<ArticleInfo>>(`select sql_calc_found_rows  * from ${ARTICLE_TABLE_NAME} where title like '%${title || ''}%' order by createTime desc limit ${limit} offset ${offset};SELECT FOUND_ROWS() as total;`)
    }

    static async getArticleById(id: number) {
        return query<ArticleInfo[]>(`select * from ${ARTICLE_TABLE_NAME} where id=${id}`);
    }

    static async getArticlePageListByCategoryId(params: RequestPageBody & { categoryId: number }) {
        const {categoryId, limit, offset} = params;
        return query<SqlPageListResponse<ArticleInfo>>(`select sql_calc_found_rows * from ${ARTICLE_TABLE_NAME} where FIND_IN_SET(${categoryId}, categories) order by createTime desc limit ${limit} offset ${offset};SELECT FOUND_ROWS() as total;`);
    }

    static async getArticlePageListByTagIdId(params: RequestPageBody & { tagId: number }) {
        const {tagId, limit, offset} = params;
        return query<SqlPageListResponse<ArticleInfo>>(`select sql_calc_found_rows * from ${ARTICLE_TABLE_NAME} where FIND_IN_SET(${tagId}, tagIds) order by createTime desc limit ${limit} offset ${offset};SELECT FOUND_ROWS() as total;`);
    }

    static async createArticle(data: CreateArticleRequestBody & { userId: number }) {
        let sqlStatement = `insert into ${ARTICLE_TABLE_NAME} (title, categories, tagIds, content, userId, updateTime, createTime) values (?, ?, ?, ?, ?, ?, ?)`;
        let currentDate = formatDate(new Date());
        let content = html_encode(data.content);
        return query<OkPacket>(sqlStatement, [data.title, data.categories, data.tagIds, content, data.userId, currentDate, currentDate])
    }

    static async editArticle(id: number, data: CreateArticleRequestBody) {
        const currentDate = formatDate(new Date());
        const content = html_encode(data.content);
        return query<OkPacket>(`update ${ARTICLE_TABLE_NAME} set title='${data.title}', categories='${data.categories}', tagIds='${data.tagIds}', content='${content}', updateTime='${currentDate}' where id = ${id}`)
    }

    static async deleteArticle(id: number) {
        return query<OkPacket>(`delete ${ARTICLE_TABLE_NAME}, ${ARTICLE_COMMENT_TABLE_NAME} from ${ARTICLE_TABLE_NAME} left join ${ARTICLE_COMMENT_TABLE_NAME} on ${ARTICLE_TABLE_NAME}.id = ${ARTICLE_COMMENT_TABLE_NAME}.articleId where ${ARTICLE_TABLE_NAME}.id = ${id}`)
    }

    static async getArticleCommentReplyListByCommentId(commentId: number) {
        return query<CommentReplyInfo[]>(`select reply.*, user.username userName, user.profilePicture userProfilePicture, toUser.username toUserName from ${ARTICLE_REPLY_TABLE_NAME} reply left join ${USER_TABLE_NAME} user ON reply.userId = user.id left join ${USER_TABLE_NAME} toUser on reply.toUserId = toUser.id where reply.commentId=${commentId}`)
    }

    static async createArticleComment(id: number, data: CreateCommentRequestBody & { userId: number }) {
        const sqlStatement = `insert into ${ARTICLE_COMMENT_TABLE_NAME} (articleId, userId, content, createTime) values (?, ?, ?, ?)`;
        const currentDate = formatDate(new Date());
        return query<OkPacket>(sqlStatement, [id, data.userId, data.content, currentDate]);
    }

    static async deleteArticleComment(commentId: number) {
        return query<OkPacket>(`delete ${ARTICLE_COMMENT_TABLE_NAME}, ${ARTICLE_REPLY_TABLE_NAME} from ${ARTICLE_COMMENT_TABLE_NAME} left join ${ARTICLE_REPLY_TABLE_NAME} on ${ARTICLE_COMMENT_TABLE_NAME}.id = ${ARTICLE_REPLY_TABLE_NAME}.commentId where ${ARTICLE_COMMENT_TABLE_NAME}.id = ${commentId}`)
    }

    static async getArticleCommentReplyListByReplyWayAndReplyId(replyWay: number, replyId: number) {
        return query<CommentReplyBaseInfo[]>(`select reply.*, user.username userName, user.profilePicture userProfilePicture, toUser.username toUserName from ${ARTICLE_REPLY_TABLE_NAME} reply left join ${USER_TABLE_NAME} user ON reply.userId = user.id left join ${USER_TABLE_NAME} toUser on reply.toUserId = toUser.id where reply.replyWay=${replyWay} and reply.replyId=${replyId}`)
    }

    static async deleteArticleCommentReplyByReplyId(replyId: number, isReply: boolean = true) {
        return query<OkPacket>(`delete from ${ARTICLE_REPLY_TABLE_NAME} where id = ${replyId} ${isReply ? `or (replyWay=20 and replyId=${replyId})` : ''}`)
    }

    static async createArticleCommentReply(commentId: number, {type, content, userId, toUserId, replyWay, replyId}: CreateArticleCommentReplyRequestBody) {
        const currentDate = formatDate(new Date());
        const sqlStatement = `insert into ${ARTICLE_REPLY_TABLE_NAME} (commentId, replyWay, replyId, userId, toUserId, content, type, createTime) values (?, ?, ?, ?, ?, ?, ?, ?)`;
        return query<OkPacket>(sqlStatement, [commentId, replyWay, replyId, userId, toUserId, content, type, currentDate]);
    }

    static async getArticleCommentAllList() {
        return query<CommentInfo[]>(`select * from ${ARTICLE_COMMENT_TABLE_NAME} order by createTime desc`)
    }

    static async getArticleCommentAllReplyList() {
        return query<CommentReplyStatementInfo[]>(`select * from ${ARTICLE_REPLY_TABLE_NAME} order by createTime desc`)
    }
}
