const {query} = require('../utils/async-db');
const {formatDate} = require('../utils/index');
const databaseNameList = require('../../config/index').databaseNameList;
const {LOGGER_TABLE_NAME} = databaseNameList;
const logger = {
	async createLogger(data) {
		let sqlStatement = `insert into ${LOGGER_TABLE_NAME} (userId, userName, host, origin, userAgent, status, url, method, createTime) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		let currentDate = formatDate(new Date());
		return query(sqlStatement, [data.userId, data.userName, data.host, data.origin, data.userAgent, data.status, data.url, data.method, currentDate])
	}
};

module.exports = logger;
