const {query} = require('../utils/async-db');
const {formatDate} = require('../utils/index');
const databaseNameList = require('../../config/index').databaseNameList;
const {ABOUT_COMMENT_TABLE_NAME, ABOUT_REPLY_TABLE_NAME, USER_TABLE_NAME} = databaseNameList;
const about = {
	createAboutComment(params) {
		const {userId, content} = params;
		const currentDate = formatDate(new Date());
        const sqlStatement = `INSERT INTO ${ABOUT_COMMENT_TABLE_NAME} (userId, content, createTime) VALUES (?, ?, ?)`;
		return query(sqlStatement, [userId, content, currentDate])
	},
	getAboutCommentList() {
		let sqlStatement = `
		SELECT 
			COMMENT.*,
			USER.username userName,
			USER.profilePicture userPic
		FROM
			${ABOUT_COMMENT_TABLE_NAME} COMMENT LEFT JOIN ${USER_TABLE_NAME} USER ON COMMENT.userId = USER.id;`;
		return query(sqlStatement)
	},
	createAboutCommentReply(params) {
		const replyType = 10;
		const type = 30;
		const {userId, sendId, commentId, content} = params;
		const currentDate = formatDate(new Date());
		const sqlStatement = `INSERT INTO ${ABOUT_REPLY_TABLE_NAME} (replyType, commentId, replyId, userId, sendId, content, type, createTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
		return query(sqlStatement, [replyType, commentId, null, userId, sendId, content, type, currentDate])
	},
	createAboutCommentReplyToReply(params) {
		const replyType = 20;
		const type = 30;
		const {userId, sendId, commentId, replyId, content} = params;
		const currentDate = formatDate(new Date());
		const sqlStatement = `INSERT INTO ${ABOUT_REPLY_TABLE_NAME} (replyType, commentId, replyId, userId, sendId, content, type, createTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
		return query(sqlStatement, [replyType, commentId, replyId, userId, sendId, content, type, currentDate])
	},
	getAboutCommentReplyList(commentId) {
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
		return query(sqlStatement);
	}
};

module.exports = about;
