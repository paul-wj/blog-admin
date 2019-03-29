const fs = require('fs');

/**
 * 遍历自定义目录下的文件目录
 * @param pathResolve 需进行遍历的目录路径
 * @param mime        遍历文件的后缀名
 * @return {object}   返回遍历后的目录结果
 */
const walkFile = (pathResolve, mime) => {
	let files = fs.readdirSync(pathResolve);
	let filesMap = {};
	files.forEach(file => {
		let [fileName, fileMime] = file.split('\.');
		if (fileMime === mime) {
			filesMap[file] = pathResolve + file;
		}
	});
	return filesMap
};

module.exports = walkFile;
