const {query} = require('../utils/async-db');
const TAG_TABLE_NAME = 'tag_info';
const CATEGORY_TABLE_NAME = 'category_info';
const tagCategory = {
	async getTagAllList() {
		return query(`select * from ${TAG_TABLE_NAME}`)
	},
	async createTag(data) {
		let sqlStatement = `insert into ${TAG_TABLE_NAME} (name, color, updateTime, createTime) values (?, ?, ?, ?)`;
		let currentDate = new Date().toLocaleString();
		return query(sqlStatement, [data.name, data.color, currentDate, currentDate])
	},
	async editTag(id, data) {
		let currentDate = new Date().toLocaleString();
		return query(`update ${TAG_TABLE_NAME} set name='${data.name}', color='${data.color}', updateTime='${currentDate}' where id = ${id}`);
	},
	async deleteTag(id) {
		return query(`delete from ${TAG_TABLE_NAME} where id = ${id}`)
	},
	async getCategoryAllList() {
		return query(`select * from ${CATEGORY_TABLE_NAME}`)
	},
	async createCategory(data) {
		let sqlStatement = `insert into ${CATEGORY_TABLE_NAME} (name, updateTime, createTime) values (?, ?, ?)`;
		let currentDate = new Date().toLocaleString();
		return query(sqlStatement, [data.name, currentDate, currentDate])
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
