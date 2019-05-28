const {query} = require('../utils/async-db');
const databaseNameList = require('../../config/index').databaseNameList;
const {USER_TABLE_NAME} = databaseNameList;
const user = {
	async registerUser(users) {
		let createTime = new Date().toLocaleString();
		let sqlStatement = `insert into ${USER_TABLE_NAME} (email, username, password, createTime) values (?, ?, ?, ?)`;
		return query(sqlStatement, [users.email, users.userName, users.password, createTime])
	},
	async queryUseExists(users) {
		return query(`select * from ${USER_TABLE_NAME} where BINARY email='${users.email}' and password='${users.password}'`)
	},
	async getUserList(params) {
		return query(`select * from ${USER_TABLE_NAME} where name like '%${params.name}%' limit ${params.limit} offset ${params.offset}`)
	},
	async getUserInfo(id) {
		return query(`select * from ${USER_TABLE_NAME} where id=${id}`)
	},
	async updateUser(id, users) {
		let updateTime = new Date().toLocaleString();
		return query(`update ${USER_TABLE_NAME} set email='${users.email}', username='${users.username}', password='${users.password}', updateTime='${updateTime}' where id = ${id}`)
	}
};

module.exports = user;
