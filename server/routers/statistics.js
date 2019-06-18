const Router = require('koa-router');
const statisticsModel = require('../controller/statistics');
let statistics = new Router();

statistics
	.get('/statistics/article', async ctx => statisticsModel.getStatisticsForArticle(ctx))
	.get('/statistics/comment', async ctx => statisticsModel.getStatisticsForComment(ctx))
	.get('/statistics/reply', async ctx => statisticsModel.getStatisticsForReply(ctx))
;
module.exports = statistics;
