import {RequestPageBody} from "./request";

export interface ArticleInfo {
    id: number;
    title: string;
    viewCount: number,
    tagIds: string | number[];
    categories: string | number[];
    content: string;
    userId: number;
    comments: number;
    updateTime: string;
    createTime: string
}

export interface CommentUserInfo {
    id: number;
    articleId: number;
    userId: number;
    content: string;
    createTime: string;
    userName: string;
    userProfilePicture: string;
}

export type CommentInfo = Omit<CommentUserInfo, 'userName' | 'userProfilePicture'>;

export interface ArticlePageListRequestBody extends RequestPageBody {
    title: string;
}

export interface CreateArticleRequestBody {
    title: string;
    content: string;
    categories: string | number[];
    tagIds: string | number[];
}

export interface CommentReplyBaseInfo {
    id: number;
    replyWay: 10 | 20,  //回复方式（10: 回复他人评论， 20：回复别人的回复）
    replyId: number;
    commentId: number;
    userId: number;
    toUserId: number;
    content: string | null;
    type: 10 | 20 | 30,   //回复类型（10：点赞，20：踩,  30: 文字回复）
    createTime: string;
    userName: string;
    userProfilePicture: string;
    toUserName: string;
}

export type CommentReplyStatementInfo = Omit<CommentReplyBaseInfo, 'userName' | 'userProfilePicture' | 'toUserName'>;

export interface CommentReplyInfo extends CommentReplyBaseInfo {
    isReply?: boolean;
    likes: number;
    dislikes: number;
}

export interface CommentAndReplyInfo extends CommentUserInfo {
    reply: {
        likes: number;
        dislikes: number;
        replyList?: CommentReplyInfo[];
    }
}

export interface CreateCommentRequestBody {
    content: string;
}

export interface CreateArticleCommentReplyRequestBody {
    commentId: number;
    replyWay: number;
    replyId: number;
    type: number;
    userId: number;
    toUserId: number;
    content: string;
}
