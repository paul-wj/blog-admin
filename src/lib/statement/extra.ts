import {query, formatDate} from '../utils';
import {databaseMap, DatabaseMap} from "../../conf";
import {OkPacket} from "mysql";
import {
    ExtraAboutCommentInfo,
    ExtraAboutCommentReplyInfo,
    ExtraAboutCommentReplyRequestBody,
    ExtraNoticeInfo, ExtraNoticeRequestBody
} from "../../types/extra";
import {LoggerInfo} from "../../middleware/logger";

const {ABOUT_COMMENT_TABLE_NAME, USER_TABLE_NAME, ABOUT_REPLY_TABLE_NAME, MESSAGE_USER, MESSAGE_CONTENT, MESSAGE, LOGGER_TABLE_NAME} = (databaseMap as DatabaseMap);

export default class ExtraStatement {
    static async createAboutComment(params: {userId: number, content: string}) {
        const {userId, content} = params;
        const currentDate = formatDate(new Date());
        const sqlStatement = `INSERT INTO ${ABOUT_COMMENT_TABLE_NAME} (userId, content, createTime) VALUES (?, ?, ?)`;
        return query<OkPacket>(sqlStatement, [userId, content, currentDate])
    }

    static async getAboutCommentReplyList(commentId: number) {
        const sqlStatement = `
        SELECT
            COMMENT_REPLY.*,
            USER.username userName,
            USER.profilePicture userPic,
            TO_USER.username toUserName,
            TO_USER.profilePicture toUserPic
        FROM
            (
                SELECT
                    REPLY.*,
                    COMMENT.content commentContent 
                FROM
                    ( SELECT * FROM about_reply WHERE commentId = ${commentId} ) REPLY
                    LEFT JOIN about_comment COMMENT ON REPLY.commentId = COMMENT.id 
            ) COMMENT_REPLY
            LEFT JOIN user_info USER ON COMMENT_REPLY.userId = USER.id
            LEFT JOIN user_info TO_USER ON COMMENT_REPLY.sendId	= TO_USER.id;
     `;
        return query<ExtraAboutCommentReplyInfo[]>(sqlStatement);
    }

    static async getAboutCommentList() {
        let sqlStatement = `
		SELECT 
			COMMENT.*,
			USER.username userName,
			USER.profilePicture userPic
		FROM
			${ABOUT_COMMENT_TABLE_NAME} COMMENT LEFT JOIN ${USER_TABLE_NAME} USER ON COMMENT.userId = USER.id;`;
        return query<ExtraAboutCommentInfo[]>(sqlStatement)
    }

    static async createAboutCommentReply(params: ExtraAboutCommentReplyRequestBody & {userId: number}) {
        const replyType = 10;
        const type = 30;
        const {userId, sendId, commentId, content} = params;
        const currentDate = formatDate(new Date());
        const sqlStatement = `INSERT INTO ${ABOUT_REPLY_TABLE_NAME} (replyType, commentId, replyId, userId, sendId, content, type, createTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        return query<OkPacket>(sqlStatement, [replyType, commentId, null, userId, sendId, content, type, currentDate])
    }

    static async createAboutCommentReplyToReply(params: ExtraAboutCommentReplyRequestBody & {userId: number}) {
        const replyType = 20;
        const type = 30;
        const {userId, sendId, commentId, replyId, content} = params;
        const currentDate = formatDate(new Date());
        const sqlStatement = `INSERT INTO ${ABOUT_REPLY_TABLE_NAME} (replyType, commentId, replyId, userId, sendId, content, type, createTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        return query<OkPacket>(sqlStatement, [replyType, commentId, replyId, userId, sendId, content, type, currentDate])
    }

    static async getUnreadMessageList(id: number) {
        const sqlStatement = `
		SELECT
			NOTICE_CONTENT.*,
			USER.profilePicture,
			USER.username sendName
		FROM
			(
			SELECT
				MESSAGE_CONTENT.*,
				MESSAGE_USER.STATUS 
			FROM
				(
				SELECT
					MESSAGE.sendId,
					MESSAGE.recId,
					MESSAGE.messageId,
					CONTENT.*
				FROM
					( SELECT * FROM message WHERE recId = ${id} ) MESSAGE
					LEFT JOIN message_content CONTENT ON MESSAGE.messageId = CONTENT.id 
				) MESSAGE_CONTENT
				LEFT JOIN message_user MESSAGE_USER ON MESSAGE_CONTENT.messageId = MESSAGE_USER.messageId 
			WHERE
			STATUS IS NULL 
	) NOTICE_CONTENT
	       LEFT JOIN user_info USER ON NOTICE_CONTENT.sendId = USER.id
	ORDER BY
        createDate DESC        
	`;
        return query<ExtraNoticeInfo[]>(sqlStatement);
    }

    static async createMessage(data: {sendId: number, recId: number, messageId: number}) {
        const sqlStatement = `insert into ${MESSAGE} (sendId, recId, messageId, createDate) values (?, ?, ?, ?)`;
        const {sendId, recId, messageId} = data;
        const currentDate = formatDate(new Date());
        return query<OkPacket>(sqlStatement, [sendId, recId, messageId, currentDate])
    }

    static async createMessageUser(data: {messageId: number, userId: number}) {
        const sqlStatement = `insert into ${MESSAGE_USER} (userId, messageId, createDate) values (?, ?, ?)`;
        const {userId, messageId} = data;
        const currentDate = formatDate(new Date());
        return query<OkPacket>(sqlStatement, [userId, messageId, currentDate])
    }

    static async batchCreateMessageUser(values: any[]) {
        const sqlStatement = `insert into ${MESSAGE_USER} (userId, messageId, createDate) values ?`;
        return query<OkPacket>(sqlStatement, [values])
    }

    static async createMessageContent(data: Pick<ExtraNoticeRequestBody, 'content' | 'title' | 'type' | 'sourceId'>) {
        const sqlStatement = `insert into ${MESSAGE_CONTENT} (type, title, content, sourceId, createDate) values (?, ?, ?, ?, ?)`;
        const {type, title, content, sourceId} = data;
        const currentDate = formatDate(new Date());
        return query<OkPacket>(sqlStatement, [type, title, content, sourceId, currentDate])
    }

    static async createLogger(logger: LoggerInfo) {
        let sqlStatement = `insert into ${LOGGER_TABLE_NAME} (userId, userName, ip, host, origin, userAgent, status, url, method, createTime) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let currentDate = formatDate(new Date());
        const {userId, userName, ip, host, origin, userAgent, status, url, method} = logger;
        return query<OkPacket>(sqlStatement, [userId, userName, ip, host, origin, userAgent, status, url, method, currentDate])
    }
}
