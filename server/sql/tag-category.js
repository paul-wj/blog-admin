const {query} = require('../utils/async-db');
const {formatDate} = require('../utils/index');
const databaseNameList = require('../../config/index').databaseNameList;
const {TAG_TABLE_NAME, CATEGORY_TABLE_NAME} = databaseNameList;
const tagCategory = {
	async getTagAllList() {
		return query(`select * from ${TAG_TABLE_NAME}`)
	},
	async getTagById(id) {
		return query(`select * from ${TAG_TABLE_NAME} where id=${id}`);
	},
	async createTag(data) {
		let sqlStatement = `insert into ${TAG_TABLE_NAME} (name, color, userId, updateTime, createTime) values (?, ?, ?, ?, ?)`;
		let currentDate = formatDate(new Date());
		return query(sqlStatement, [data.name, data.color, data.userId, currentDate, currentDate])
	},
	async editTag(id, data) {
		let currentDate = formatDate(new Date());
		return query(`update ${TAG_TABLE_NAME} set name='${data.name}', color='${data.color}', updateTime='${currentDate}' where id = ${id}`);
	},
	async deleteTag(id) {
		return query(`delete from ${TAG_TABLE_NAME} where id = ${id}`)
	},
	async getCategoryAllList() {
		return query(`select * from ${CATEGORY_TABLE_NAME}`)
	},
	async getCategoryById(id) {
		return query(`select * from ${CATEGORY_TABLE_NAME} where id=${id}`);
	},
	async createCategory(data) {
		let sqlStatement = `insert into ${CATEGORY_TABLE_NAME} (name, userId, updateTime, createTime) values (?, ?, ?, ?)`;
		let currentDate = formatDate(new Date());
		return query(sqlStatement, [data.name, data.userId, currentDate, currentDate])
	},
	async editCategory(id, data) {
		let currentDate = new Date().toLocaleString();
		return query(`update ${CATEGORY_TABLE_NAME} set name='${data.name}', updateTime='${currentDate}' where id = ${id}`);
	},
	async deleteCategory(id) {
		return query(`delete from ${CATEGORY_TABLE_NAME} where id = ${id}`)
	}
};
module.exports = tagCategory;
