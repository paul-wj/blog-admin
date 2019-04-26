const html_encode = str => {
	let result = '';
	if (!str) {
		return result;
	}
	result = str.replace(/&/g, "&amp;");
	result = result.replace(/</g, "&lt;");
	result = result.replace(/>/g, "&gt;");
	result = result.replace(/ /g, "&nbsp;");
	result = result.replace(/\'/g, "&#39;");
	result = result.replace(/\"/g, "&quot;");
	result = result.replace(/\n/g, "<br/>");
	return result;
};

const html_decode = str => {
	let result = '';
	if (!str) {
		return result;
	}
	result = str.replace(/&amp;/g, "&");
	result = result.replace(/&lt;/g, "<");
	result = result.replace(/&gt;/g, ">");
	result = result.replace(/&nbsp;/g, " ");
	result = result.replace(/&#39;/g, "\'");
	result = result.replace(/&quot;/g, "\"");
	result = result.replace(/<br\/>/g, "\n");
	return result;
};

module.exports = {html_encode, html_decode};
