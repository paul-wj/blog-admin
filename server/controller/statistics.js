const dayJs = require('dayjs');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const createResponse = require('../utils/create-response');
const articleSql = require('../sql/article');
const config = require('../../config');

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
	},
	async getStatisticsForComment(ctx) {
		const res = await articleSql.getArticleCommentAllList();
		let response = createResponse();
		let result =  {
			total: 0,
			dayTotal: 0,
			weekTotal: 0,
			weekRingRatio: 0,
			dayRingRatio: 0
		};
		if (res && res.length) {
			const lastDayTotal = res.filter(comment => dayJs(comment.createTime).isSame(dayJs().subtract(1, 'day'), 'day')).length;
			const dayTotal = res.filter(comment => dayJs(comment.createTime).isSame(dayJs(), 'day')).length;
			const lastWeekTotal = res.filter(comment => dayJs(comment.createTime).isSame(dayJs().day(-6), 'day') || dayJs(comment.createTime).isSame(dayJs().day(0), 'day') || (dayJs(comment.createTime).isAfter(dayJs().day(-6)) && dayJs(comment.createTime).isBefore(dayJs().day(0))) ).length;
			const weekTotal = res.filter(comment => dayJs(comment.createTime).isSame(dayJs().day(1), 'day') || dayJs(comment.createTime).isSame(dayJs().day(7), 'day') ||  (dayJs(comment.createTime).isAfter(dayJs().day(1)) && dayJs(comment.createTime).isBefore(dayJs().day(7)))).length;
			result.total = res.length;
			result.dayTotal = dayTotal;
			result.dayRingRatio = (dayTotal && lastDayTotal) ? ((dayTotal - lastDayTotal)/lastDayTotal).toFixed(2) - 0 : 0;
			result.weekTotal = weekTotal;
			result.weekRingRatio = (lastWeekTotal && weekTotal) ? ((weekTotal - lastWeekTotal)/weekTotal).toFixed(2) - 0 : 0;
		}
		response.message = '成功';
		response.result = result;
		ctx.body = response;
	},
	async getStatisticsForReply(ctx) {
		const res = await articleSql.getArticleCommentAllReplyList();
		let response = createResponse();
		let result =  {
			total: 0,
			dayTotal: 0,
			weekTotal: 0,
			weekRingRatio: 0,
			dayRingRatio: 0
		};
		if (res && res.length) {
			const lastDayTotal = res.filter(reply => dayJs(reply.createTime).isSame(dayJs().subtract(1, 'day'), 'day')).length;
			const dayTotal = res.filter(reply => dayJs(reply.createTime).isSame(dayJs(), 'day')).length;
			const lastWeekTotal = res.filter(reply => dayJs(reply.createTime).isSame(dayJs().day(-6), 'day') || dayJs(reply.createTime).isSame(dayJs().day(0), 'day') || (dayJs(reply.createTime).isAfter(dayJs().day(-6)) && dayJs(reply.createTime).isBefore(dayJs().day(0))) ).length;
			const weekTotal = res.filter(reply => dayJs(reply.createTime).isSame(dayJs().day(1), 'day') || dayJs(reply.createTime).isSame(dayJs().day(7), 'day') ||  (dayJs(reply.createTime).isAfter(dayJs().day(1)) && dayJs(reply.createTime).isBefore(dayJs().day(7)))).length;
			result.total = res.length;
			result.dayTotal = dayTotal;
			result.dayRingRatio = (dayTotal && lastDayTotal) ? ((dayTotal - lastDayTotal)/lastDayTotal).toFixed(2) - 0 : 0;
			result.weekTotal = weekTotal;
			result.weekRingRatio = (lastWeekTotal && weekTotal) ? ((weekTotal - lastWeekTotal)/weekTotal).toFixed(2) - 0 : 0;
		}
		response.message = '成功';
		response.result = result;
		ctx.body = response;
	},
	async uploadFile(ctx) {
		const {host} = ctx.request.header;
		let response = createResponse();
		const file = ctx.request.files.file;
		const fileName = file.name;
		// 创建可读流
		const render = fs.createReadStream(file.path);
		const filePath = path.join(config.BASE_PATH, 'static/upload/', fileName);
		const fileDir = path.join(config.BASE_PATH, 'static/upload/');
		if (!fs.existsSync(fileDir)) {
			fs.mkdirSync(fileDir, err => {
				console.log(err);
				console.log('创建失败')
			});
		}
		// 创建写入流
		const upStream = fs.createWriteStream(filePath);
		render.pipe(upStream);
		response.result = `http://${host}/upload/${fileName}`;
		response.message = '上传成功';
		ctx.body = response;
	}
};

module.exports = statistics;
