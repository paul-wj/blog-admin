const noticeSql = require('../sql/notice');
const userSql = require('../sql/user');
const createResponse = require('../utils/create-response');
const {getTokenResult} = require('../utils/check-token');
const {webSocketObj} = require('../utils/web-socket');
const {formatDate} = require('../utils/index');


const notice = {
	async createNotice(data) {
		const {sendId, recId, content, title, type, sourceId} = data;
		const messageContentRes = await noticeSql.createMessageContent({content, title, type, sourceId});
		if (messageContentRes && messageContentRes.insertId) {
			const messageId = messageContentRes.insertId;
			const messageRes = await noticeSql.createMessage({sendId, recId, messageId});
			if (messageRes && messageRes.insertId) {
				const userList = await userSql.getAllUserList();
				if (userList && userList.length) {
					const sendName = userList.find(user => user.id === sendId).username;
					const noticeResult = {sendName, content, title, type};
					if (recId === 0) {
						webSocketObj.sendSystemNotice(noticeResult)
					} else {
						webSocketObj.sendNotice(recId, noticeResult)
					}
				} else {
					console.log(`用户表不存在或用户不存在，无法发送通知`)
				}
			}
		}
	},
	async getUnreadMessageList(ctx) {
		const authorization = ctx.header.authorization;
		const userInfo = await getTokenResult(authorization);
		const {id} = userInfo || {id: null};
		const response = createResponse();
		if (id) {
			const unreadMessageList = await noticeSql.getUnreadMessageList(id);
			if (unreadMessageList && unreadMessageList.length) {
				response.code = 0;
				response.message = '成功';
				response.results = unreadMessageList;
			}else {
				response.code = 404;
				response.message = '信息不存在';
			}
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async createMessageUser(ctx) {
		const authorization = ctx.header.authorization;
		const userInfo = await getTokenResult(authorization);
		const requestBody = ctx.request.body;
		const {id} = userInfo;
		const {messageId} = requestBody;
		const response = createResponse();
		const res = await noticeSql.createMessageUser({messageId, userId: id});
		if (res && res.insertId !== undefined) {
			response.message = '成功';
		}
		ctx.body = response;
	},
	async batchCreateMessageUser(ctx) {
		const authorization = ctx.header.authorization;
		const userInfo = await getTokenResult(authorization);
		const requestBody = ctx.request.body;
		const {id} = userInfo;
		const {messageIdList} = requestBody;
		const currentDate = formatDate(new Date());
		const sqlValues = messageIdList.map(messageId => [id, messageId, currentDate]);
		const response = createResponse();
		const res = await noticeSql.batchCreateMessageUser(sqlValues);
		if (res &&  res.insertId !== undefined) {
			response.message = '成功';
		}
		ctx.body = response;
	}
};

module.exports = notice;
