import SocketIo, {Socket} from 'socket.io'
import {Server} from 'http';
import { formatDate } from "./index";

const roomPrefix = 'user_';

interface WebSocketObj {
    noticeRooms: Record<string, string>,
    webSocketIo: SocketIO.Server,
    sendNotice: (userId: number, data: any) => void,
    sendSystemNotice: (data: any) => void
}

export const webSocketObj: WebSocketObj = {
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
        keys.forEach(key => {
            const currentSocket = sockets[noticeRooms[key]];
            if (currentSocket) {
                currentSocket.emit('getNotice', data);
            }
        });
    }
};

export const startWebSocketApp = (server: Server) => {
    const webSocketIo = webSocketObj.webSocketIo = SocketIo(server, {path: '/notice'});
    const {noticeRooms} = webSocketObj;
    //webSocket监听方法
    webSocketIo.on('connection', (socket: Socket) => {
        console.log('初始化成功！下面可以用socket绑定事件和触发事件了', formatDate(new Date()));
        socket.on(`joinNoticeRoom`, (userId: number) => {
            console.log('加入房间：', userId, formatDate(new Date()));
            //根据当前用户id记录当前room id
            noticeRooms[`user_${userId}`] = socket.id;
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
