const {query} = require('../utils/async-db');
const {formatDate} = require('../utils/index');
const databaseNameList = require('../../config/index').databaseNameList;
const {MESSAGE, MESSAGE_CONTENT, MESSAGE_USER} = databaseNameList;
const notice = {
	async createMessageContent(data) {
		const sqlStatement = `insert into ${MESSAGE_CONTENT} (type, title, content, sourceId, createDate) values (?, ?, ?, ?, ?)`;
		const {type, title, content, sourceId} = data;
		const currentDate = formatDate(new Date());
		return query(sqlStatement, [type, title, content, sourceId, currentDate])
	},
	async createMessage(data) {
		const sqlStatement = `insert into ${MESSAGE} (sendId, recId, messageId, createDate) values (?, ?, ?, ?)`;
		const {sendId, recId, messageId} = data;
		const currentDate = formatDate(new Date());
		return query(sqlStatement, [sendId, recId, messageId, currentDate])
	},
	async createMessageUser(data) {
		const sqlStatement = `insert into ${MESSAGE_USER} (userId, messageId, createDate) values (?, ?, ?)`;
		const {userId, messageId} = data;
		const currentDate = formatDate(new Date());
		return query(sqlStatement, [userId, messageId, currentDate])
	},
	async batchCreateMessageUser(values) {
		const sqlStatement = `insert into ${MESSAGE_USER} (userId, messageId, createDate) values ?`;
		return query(sqlStatement, [values])
	},
	async getUnreadMessageList(id) {
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
	`;
		return query(sqlStatement);
	}
};

module.exports = notice;
