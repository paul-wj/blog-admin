const roomPrefix = 'user_';

const webSocketObj = {
	noticeRooms: {},
	webSocketIo: null,
	sendNotice(userId, data) {
		const {noticeRooms, webSocketIo} = this;
		const keys = Object.keys(noticeRooms);
		if (!userId || !webSocketIo || !keys.length || !data) {
			return
		}
		const sockets = webSocketIo.sockets.sockets;
		const currentSocket = sockets[noticeRooms[`${roomPrefix}${userId}`]];
		if (currentSocket) {
			currentSocket.emit('getNotice', data);
		}
	},
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
		console.log('初始化成功！下面可以用socket绑定事件和触发事件了');
		socket.on(`joinNoticeRoom`, data => {
			console.log('加入房间：', data);
			noticeRooms[`user_${data}`] = socket.id;
		});
	});
};

module.exports = {startWebSocketApp, webSocketObj};
