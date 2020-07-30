export interface ExtraAboutCommentRequestBody {
    content: string;
}

export interface ExtraAboutCommentReplyInfo {
    id: number;
    replyType: number;
    commentId: number;
    replyId: number;
    userId: number;
    sendId: number;
    content: string;
    type: number;
    createTime: string;
    commentContent: string;
    userName: string;
    userPic: string;
    toUserName: string;
    toUserPic: string;
}

export interface ExtraAboutCommentInfo {
    id: number;
    userId: number;
    content: string;
    createTime: string;
    userName: string;
    userPic: string;
    replyList: ExtraAboutCommentReplyInfo[];
}

export interface ExtraAboutCommentReplyRequestBody {
    sendId: number;
    commentId: number;
    content: string;
    replyId?: number;
    replyType?: 10 | 20;
}

export interface ExtraStatisticsInfo {
    total: number;
    dayTotal: number;
    weekTotal: number;
    weekRingRatio: number;
    dayRingRatio: number;
}

export interface ExtraStatisticsTotalInfo {
    lastDayTotal: number;
    dayTotal: number;
    lastWeekTotal: number;
    weekTotal: number;
}

export interface ExtraNoticeInfo {
    sendId: number;
    recId: number;
    messageId: number;
    id: number;
    type: number;
    title: string;
    sourceId: number;
    content: string;
    createDate: string;
    STATUS: number;
    profilePicture: string;
    sendName: string;
}

export interface ExtraReadMessageRequestBody {
    messageId: number;
}

export interface ExtraNoticeRequestBody {
    sendId: number;
    recId: number;
    content: string;
    title: string;
    type: number;
    sourceId: number;
}

export interface ExtraSongInfo {
    id: number;
    author: string;
    name: string;
    picUrl: string;
    url: string;
}

