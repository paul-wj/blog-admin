const {query} = require('../utils/async-db');
const {formatDate} = require('../utils/index');
const databaseNameList = require('../../config/index').databaseNameList;
const {USER_TABLE_NAME} = databaseNameList;
const user = {
	async registerUser(users) {
		let createTime = formatDate(new Date());
		let sqlStatement = `insert into ${USER_TABLE_NAME} (email, username, password, profilePicture, createTime) values (?, ?, ?, ?, ?)`;
		return query(sqlStatement, [users.email, users.username, users.password, users.profilePicture, createTime])
	},
	async queryUseExists(users) {
		return query(`select * from ${USER_TABLE_NAME} where BINARY email='${users.email}' and password='${users.password}'`)
	},
	async getUserList(params) {
		return query(`select * from ${USER_TABLE_NAME} where name like '%${params.name}%' limit ${params.limit} offset ${params.offset}`)
	},
	async getAllUserList() {
		return query(`select * from ${USER_TABLE_NAME}`)
	},
	async getUserInfo(id) {
		return query(`select * from ${USER_TABLE_NAME} where id=${id}`)
	},
	async updateUser(id, users) {
		let updateTime = formatDate(new Date());
		return query(`update ${USER_TABLE_NAME} set email='${users.email}', username='${users.username}', password='${users.password}', profilePicture='${users.profilePicture}', updateTime='${updateTime}' where id = ${id}`)
	}
};

module.exports = user;
