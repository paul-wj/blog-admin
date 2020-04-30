import {query, formatDate} from '../utils';
import { databaseMap, DatabaseMap } from "../../conf";
import {CatalogInfo, CatalogRequestBody, TagInfo, TagRequestBody} from "../../types/tag-catalog";
import {OkPacket} from "mysql";

const {TAG_TABLE_NAME, CATEGORY_TABLE_NAME} = (databaseMap as DatabaseMap);

export default class TagCatalogStatement {

    static async createTag(data: TagRequestBody & { userId: number }) {
        const sqlStatement = `insert into ${TAG_TABLE_NAME} (name, color, userId, updateTime, createTime) values (?, ?, ?, ?, ?)`;
        const currentDate = formatDate(new Date());
        return query<OkPacket>(sqlStatement, [data.name, data.color, data.userId, currentDate, currentDate])
    }

    static async editTag(id: number, data: TagRequestBody) {
        const currentDate = formatDate(new Date());
        return query<OkPacket>(`update ${TAG_TABLE_NAME} set name='${data.name}', color='${data.color}', updateTime='${currentDate}' where id = ${id}`);
    }

    static async deleteTag(id: number) {
        return query<OkPacket>(`delete from ${TAG_TABLE_NAME} where id = ${id}`)
    }

    static async getTagById(id: number) {
        return query<TagInfo[]>(`select * from ${TAG_TABLE_NAME} where id=${id}`);
    }

    static async getTagAllList() {
        return query<TagInfo[]>(`select * from ${TAG_TABLE_NAME}`)
    }

    static async getCategoryAllList() {
        return query<CatalogInfo[]>(`select * from ${CATEGORY_TABLE_NAME}`)
    }

    static async createCategory(data: CatalogRequestBody & {userId: number}) {
        const sqlStatement = `insert into ${CATEGORY_TABLE_NAME} (name, userId, updateTime, createTime) values (?, ?, ?, ?)`;
        const currentDate = formatDate(new Date());
        return query<OkPacket>(sqlStatement, [data.name, data.userId, currentDate, currentDate])
    }

    static async getCategoryById(id: number) {
        return query<CatalogInfo[]>(`select * from ${CATEGORY_TABLE_NAME} where id=${id}`);
    }

    static async editCategory(id: number, data: CatalogRequestBody) {
        const currentDate = new Date().toLocaleString();
        return query<OkPacket>(`update ${CATEGORY_TABLE_NAME} set name='${data.name}', updateTime='${currentDate}' where id = ${id}`);
    }

    static async deleteCategory(id: number) {
        return query<OkPacket>(`delete from ${CATEGORY_TABLE_NAME} where id = ${id}`)
    }
}
