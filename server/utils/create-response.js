module.exports = function createResponse(isResults = false, code = 0, result = null, message) {
	let response = {code, message};
	response[`result${isResults ? 's' : ''}`] = result;
	return response;
};
