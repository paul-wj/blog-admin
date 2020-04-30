import {RequestPageBody} from "./request";

export interface LoginRequestParams {
    account: string;
    password: string;
}

export interface UserInfo {
    id: number;
    email: string;
    password: string;
    username: string;
    profilePicture: string;
    nick: string;
    createTime: string;
    updateTime: string;
}

export type SingleUserInfo = Omit<UserInfo, 'password'>;

export interface UserListRequestBody extends RequestPageBody{
    name: string;
}

export interface RegisterUserRequestBody {
    email: string;
    username: string;
    password: string;
    profilePicture: string;
}
