const {query} = require('../utils/async-db');
const USER_TABLE_NAME = 'user_info';
const user = {
	async createUser(users) {
		let sqlStatement = `insert into ${USER_TABLE_NAME} (name, password) values (?, ?)`;
		return query(sqlStatement, [users.userName, users.password])
	},
	async queryUseExists(users) {
		return query(`select * from ${USER_TABLE_NAME} where BINARY name='${users.username}' and password='${users.password}'`)
	},
	async getUserList(params) {
		return query(`select * from ${USER_TABLE_NAME} where name like '%${params.name}%' limit ${params.limit} offset ${params.offset}`)
	}
};

module.exports = user;
