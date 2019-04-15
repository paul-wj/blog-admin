module.exports = function createResponse(isResults = false, code, result, message) {
	let response = {code, message};
	response[`result${isResults ? 's' : ''}`] = result;
	return response;
};
