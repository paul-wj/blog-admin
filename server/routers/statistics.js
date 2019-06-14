const Router = require('koa-router');
const statisticsModel = require('../controller/statistics');
let statistics = new Router();

statistics
	.get('/statistics/article', async ctx => statisticsModel.getStatisticsForArticle(ctx))
;
module.exports = statistics;
