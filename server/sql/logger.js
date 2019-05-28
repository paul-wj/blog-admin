const {query} = require('../utils/async-db');
const databaseNameList = require('../../config/index').databaseNameList;
const {LOGGER_TABLE_NAME} = databaseNameList;
const logger = {
	async createLogger(data) {
		let sqlStatement = `insert into ${LOGGER_TABLE_NAME} (userId, userName, host, status, url, method, createTime) values (?, ?, ?, ?, ?, ?, ?)`;
		let currentDate = new Date().toLocaleString();
		return query(sqlStatement, [data.userId, data.userName, data.host, data.status, data.url, data.method, currentDate])
	}
};

module.exports = logger;
