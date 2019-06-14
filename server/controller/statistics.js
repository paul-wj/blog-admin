const dayJs = require('dayjs');
const Joi = require('joi');
const createResponse = require('../utils/create-response');
const articleSql = require('../sql/article');
const statistics = {
	async getStatisticsForArticle(ctx) {
		const res = await articleSql.getArticleAllList();
		let response = createResponse();
		let result =  {
			total: 0,
			dayTotal: 0,
			weekTotal: 0,
			weekRingRatio: 0,
			dayRingRatio: 0
		};
		if (res && res.length) {
			const lastDayTotal = res.filter(article => dayJs(article.createTime).isSame(dayJs().subtract(1, 'day'), 'day')).length;
			const dayTotal = res.filter(article => dayJs(article.createTime).isSame(dayJs(), 'day')).length;
			const lastWeekTotal = res.filter(article => dayJs(article.createTime).isSame(dayJs().day(-6), 'day') || dayJs(article.createTime).isSame(dayJs().day(0), 'day') || (dayJs(article.createTime).isAfter(dayJs().day(-6)) && dayJs(article.createTime).isBefore(dayJs().day(0))) ).length;
			const weekTotal = res.filter(article => dayJs(article.createTime).isSame(dayJs().day(1), 'day') || dayJs(article.createTime).isSame(dayJs().day(7), 'day') ||  (dayJs(article.createTime).isAfter(dayJs().day(1)) && dayJs(article.createTime).isBefore(dayJs().day(7)))).length;
			result.total = res.length;
			result.dayTotal = dayTotal;
			result.dayRingRatio = (dayTotal && lastDayTotal) ? ((dayTotal - lastDayTotal)/lastDayTotal).toFixed(2) - 0 : 0;
			result.weekTotal = weekTotal;
			result.weekRingRatio = (lastWeekTotal && weekTotal) ? ((weekTotal - lastWeekTotal)/weekTotal).toFixed(2) - 0 : 0;
		}
		response.message = '成功';
		response.result = result;
		ctx.body = response;
	}
};

module.exports = statistics;
