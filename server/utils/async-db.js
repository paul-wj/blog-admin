const mysql = require('mysql');
const config = require('../../config');
const pool = mysql.createPool({
	host: config.database.HOST,
	user: config.database.USERNAME,
	password: config.database.PASSWORD,
	database: config.database.DATABASE,
	multipleStatements: true
});
let query = (sql, values) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if(err){
				reject(err);
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
					connection.release();
				})
			}
		});
	});
};

let newQuery = (sql, values) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if(err){
				reject({err, results: null});
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject({err, results: null});
					} else {
						resolve({err: null, results: rows});
					}
					connection.release();
				})
			}
		});
	});
};

module.exports = { query };
