const axios = require('axios');
const dayJs = require('dayjs');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const createResponse = require('../utils/create-response');
const articleSql = require('../sql/article');
const config = require('../../config');
const weatherCity = require('../../config/weather-city.json');

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
		response.result = `https://www.wangjie818.wang/upload/${fileName}`;
		response.message = '上传成功';
		ctx.body = response;
	},
	async getSongList(ctx) {
		let response = createResponse(true);
		const songUrl = 'https://api.imjad.cn/cloudmusic/?type=playlist&id=2972264118';
		const result = await axios.get(songUrl).then(res => res).catch(err => err);
		const res = result ? result.data : null;
		let songIdList = [];
		let songList = [];
		const getFinallyAuthor = authorList => authorList.reduce((startValue, currentValue, currentIndex) => `${startValue}${currentValue.name}${currentIndex !== authorList.length -1 ? '/' : ''}`, '');
		if (res && res.code === 200) {
			const {playlist} = res;
			if (playlist && playlist.tracks) {
				songIdList = playlist.trackIds.map(item => item.id);
				songList = playlist.tracks.map(track => {
					const {id, name, ar, al} = track;
					delete songIdList[songIdList.indexOf(id)];
					return {
						id,
						author: getFinallyAuthor(ar),
						name: name,
						picUrl: al.picUrl,
						url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`
					}
				});
				songIdList = songIdList.filter(song => !!song);
				if (songIdList.length) {
					const processArray = async idList => {
						for (let id of idList) {
							const result = await axios.get(`http://music.163.com/api/song/detail/?id=[${id}]&ids=[${id}]&csrf_token=`).then(res => res).catch(err => err);
							const res = result ? result.data : null;
							if (res && res.code === 200) {
								const {songs: [song]} = res;
								if (song) {
									const {name, id, artists, album: {picUrl}} = song;
									songList.push({
										id,
										author: getFinallyAuthor(artists),
										name,
										picUrl: picUrl.indexOf('https') > -1 ? picUrl : `https${picUrl.substring(4, picUrl.length)}`,
										url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`
									})
								}
							}
						}
					};
					await processArray(songIdList);
				}
			}
		}
		if (songList.length) {
			response.code = 0;
			response.message = '成功';
			response.results = songList;
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async getWeatherByCurrentCity(ctx) {
		let response = createResponse();
		const {cname} = ctx.query;
		const {cip} = ctx.header;
		const result = await axios.get(`http://ip.taobao.com/service/getIpInfo.php?ip=${cip}`).then(res => res).catch(err => err);
		const res = result ? result.data : null;
		const cityList = weatherCity.CityCode.reduce((startValue, nextValue) => startValue.concat([...nextValue.cityList].reduce((firstValue, secondValue) => firstValue.concat(secondValue.countyList), [])), []);
		let cityCode;
		if (res && res.code === 0) {
			const {city} = res.data;
			cityCode = cityList.find(item => item.name === city).code;
		} else {
			cityCode = cityList.find(item => item.name === cname.split('市')[0]).code;
		}
		const weatherResult = await axios.get(`https://apip.weatherdt.com/plugin/data?key=KbzQ7JDMhF&lang=zh&location=${cityCode}`).then(res => res).catch(err => err);
		const weatherRes = weatherResult ? weatherResult.data : null;
		if (weatherRes && weatherRes.status === 'ok') {
			response.result = weatherRes;
		}
		ctx.body = response;
	}
};

module.exports = statistics;
