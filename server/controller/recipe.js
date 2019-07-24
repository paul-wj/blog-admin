const createResponse = require('../utils/create-response');
const recipeSql = require('../sql/recipe');
const dayJs = require('dayjs');
const recipe = {
	async getRecipeAllList(ctx) {
		let res = await recipeSql.getRecipeAllList();
		let response = createResponse(true);
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			response.results = res;
		} else {
			response.code = 404;
			response.message = '信息不存在';
		}
		ctx.body = response;
	},
	async createWeekRecipe(recipeList) {
		const weekIndexList = [...Array(7).keys()];
		let results = [];
		async function processArray(arr) {
			for (let weekIndex of arr) {
				const recipeDate = dayJs().day(weekIndex + 1).format('YYYY/MM/DD');
				const createRecipeIds = () => recipeList[Math.floor(Math.random() * recipeList.length)].id;
				const recipes = [createRecipeIds(), createRecipeIds()];
				if (recipes[0] === recipes[1]) {
					let recipeIds = createRecipeIds();
					recipes.splice(1, 1, recipes[0] === recipeIds ? createRecipeIds() : recipeIds)
				}
				const res = await recipeSql.createRecipeDate({recipeDate, recipes: recipes.toString()});
				results.push(res);
			}
		}
		await processArray(weekIndexList);
		return results;
	},
	async getCurrentWeekRecipe(ctx) {
		const recipeList = await recipeSql.getRecipeAllList();
		let response = createResponse(true);
		let res = await recipeSql.getCurrentWeekRecipe();
		if (res && res.length) {
			response.code = 0;
			response.message = '成功';
			response.results = res.map(item => Object.assign({}, item, {recipes: item.recipes.split(',').map(id => recipeList.find(recipe => recipe.id === id - 0).name)}));
		} else {
			const results = await this.createWeekRecipe(recipeList);
			if (results.every(result => result && result.insertId !== undefined)) {
				res = await recipeSql.getCurrentWeekRecipe();
				response.results = res.map(item => Object.assign({}, item, {recipes: item.recipes.split(',').map(id => recipeList.find(recipe => recipe.id === id - 0).name)}));
				response.code = 0;
				response.message = '成功';
			} else {
				response.code = 404;
				response.message = '信息不存在';
			}
		}
		ctx.body = response;
	}
};

module.exports = recipe;
