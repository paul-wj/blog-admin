const {formatDate} = require('./index');
const roomPrefix = 'user_';

const webSocketObj = {
	noticeRooms: {},
	webSocketIo: null,
	//向指定用户发送消息
	sendNotice(userId, data) {
		const {noticeRooms, webSocketIo} = this;
		const keys = Object.keys(noticeRooms);
		if (!userId || !webSocketIo || !keys.length || !data) {
			return
		}
		const sockets = webSocketIo.sockets.sockets;
		//通过当前用户userId获取当前用户room
		const currentSocket = sockets[noticeRooms[`${roomPrefix}${userId}`]];
		if (currentSocket) {
			//向当前用户room发送通知
			currentSocket.emit('getNotice', data);
		}
	},
	//发送全局系统消息
	sendSystemNotice(data) {
		const {noticeRooms, webSocketIo} = this;
		const keys = Object.keys(noticeRooms);
		if (!data || !webSocketIo || !keys.length) {
			return
		}
		const sockets = this.webSocketIo.sockets.sockets;
		// keys = keys.filter(key => noticeRooms[key] !== socket.id);
		keys.forEach(key => {
			const currentSocket = sockets[noticeRooms[key]];
			if (currentSocket) {
				currentSocket.emit('getNotice', data);
			}
		});
	}
};

const startWebSocketApp = server => {
	const webSocketIo = webSocketObj.webSocketIo = require('socket.io')(server, {path: '/notice'});
	const {noticeRooms} = webSocketObj;
	//webSocket监听方法
	webSocketIo.on('connection', socket => {
		console.log('初始化成功！下面可以用socket绑定事件和触发事件了', formatDate(new Date()));
		socket.on(`joinNoticeRoom`, data => {
			console.log('加入房间：', data, formatDate(new Date()));
			//根据当前用户id记录当前room id
			noticeRooms[`user_${data}`] = socket.id;
		});
		socket.on('disconnect', () => {
			const currentRoomKey = Object.keys(noticeRooms).find(key => noticeRooms[key] === socket.id);
			if (typeof currentRoomKey === "string") {
				const [, roomId] = currentRoomKey.split('_');
				console.log(`房间${roomId}断开连接`, formatDate(new Date()));
			} else {
				console.log(`房间断开连接`, formatDate(new Date()));
			}
		});
	});
};

module.exports = {startWebSocketApp, webSocketObj};
