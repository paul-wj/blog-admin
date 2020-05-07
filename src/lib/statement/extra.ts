import {query, formatDate} from '../utils';
import {databaseMap, DatabaseMap} from "../../conf";
import {OkPacket} from "mysql";
import {ExtraAboutCommentInfo, ExtraAboutCommentReplyInfo, ExtraAboutCommentReplyRequestBody} from "../../types/extra";

const {ABOUT_COMMENT_TABLE_NAME, USER_TABLE_NAME, ABOUT_REPLY_TABLE_NAME} = (databaseMap as DatabaseMap);

export default class TagCatalogStatement {
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
		USER.profilePicture userPic 
	FROM
		(
		SELECT
			REPLY.*,
			COMMENT.content commentContent 
		FROM
			( SELECT * FROM about_reply WHERE commentId = ${commentId} ) REPLY
			LEFT JOIN about_comment COMMENT ON REPLY.commentId = COMMENT.id 
		) COMMENT_REPLY
		LEFT JOIN user_info USER ON COMMENT_REPLY.userId = USER.id;
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
}
