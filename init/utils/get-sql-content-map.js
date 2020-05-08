const fs = require('fs');
const path = require('path');
const walkFile = require('./walk-file');

let sqlContentMap = {};
const getSqlContent = (fileName, path) => {
	sqlContentMap[fileName] = fs.readFileSync(path, 'binary');
};
const getSqlContentMap = () => {
	let sqlMap = walkFile(path.resolve(__dirname, '../sql').replace(/\\/g, '\/') + '/', 'sql');
	for (let key in sqlMap) {
		getSqlContent(key, sqlMap[key]);
	}
	return sqlContentMap;
};

module.exports = getSqlContentMap;
