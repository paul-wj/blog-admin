import {query, formatDate} from '../utils';
import {LoginRequestParams, UserListRequestBody, RegisterUserRequestBody, UserInfo} from "../../types/user";
import {databaseMap, DatabaseMap} from "../../conf";
import {OkPacket} from "mysql";
import {SqlPageListResponse} from "../../types/response";

const USER_TABLE_NAME = (databaseMap as DatabaseMap).USER_TABLE_NAME;

export default class UserStatement {
    static async registerUser(params: RegisterUserRequestBody) {
        const sqlStatement = `insert into ${USER_TABLE_NAME} (email, username, password, profilePicture, createTime) values (?, ?, ?, ?, ?)`;
        return query<OkPacket>(sqlStatement, [params.email, params.username, params.password, params.profilePicture, formatDate(new Date())])
    }

    static async queryUseExists(params: LoginRequestParams) {
        return query<UserInfo[]>(`select * from ${USER_TABLE_NAME} where BINARY (username='${params.account}' or email='${params.account}') and password='${params.password}'`);
    }

    static async updateUser(id: number, users: RegisterUserRequestBody) {
        return query<OkPacket>(`update ${USER_TABLE_NAME} set email='${users.email}', username='${users.username}', password='${users.password}', profilePicture='${users.profilePicture}', updateTime='${formatDate(new Date())}' where id = ${id}`)
    }

    static async queryUserInfo(id: number) {
        return query<UserInfo[]>(`select * from ${USER_TABLE_NAME} where id=${id}`)
    }

    static async queryUserList(params: UserListRequestBody) {
        const {name, limit, offset} = params;
        return query<SqlPageListResponse<UserInfo>>(`select * from ${USER_TABLE_NAME} where username like '%${ name || ''}%' limit ${limit} offset ${offset};SELECT FOUND_ROWS() as total;`);
    }
}
