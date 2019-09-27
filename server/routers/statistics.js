const Router = require('koa-router');
const statisticsModel = require('../controller/statistics');
let statistics = new Router();

statistics
	.post('/upload', async ctx => statisticsModel.uploadFile(ctx))
	.get('/statistics/article', async ctx => statisticsModel.getStatisticsForArticle(ctx))
	.get('/statistics/comment', async ctx => statisticsModel.getStatisticsForComment(ctx))
	.get('/statistics/reply', async ctx => statisticsModel.getStatisticsForReply(ctx))
	.get('/song', async ctx => statisticsModel.getSongList(ctx))
	.get('/weather', async ctx => statisticsModel.getWeatherByCurrentCity(ctx))
;
module.exports = statistics;
