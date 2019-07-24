const {query} = require('../utils/async-db');
const databaseNameList = require('../../config/index').databaseNameList;
const {RECIPE_TABLE_NAME, RECIPE_DATE_TABLE_NAME} = databaseNameList;
const dayJs = require('dayjs');
const recipe = {
	async getRecipeAllList() {
		return query(`select * from ${RECIPE_TABLE_NAME}`)
	},
	async createRecipeDate(data) {
		let sqlStatement = `insert into ${RECIPE_DATE_TABLE_NAME} (recipeDate, recipes) values (?, ?)`;
		return query(sqlStatement, [data.recipeDate, data.recipes])
	},
	async getCurrentWeekRecipe() {
		return query(`select * from ${RECIPE_DATE_TABLE_NAME} where date_format(recipeDate,'%Y/%m/%d') between '${dayJs().day(1).format('YYYY/MM/DD')}' and '${dayJs().day(7).format('YYYY/MM/DD')}'`)
	}
};
module.exports = recipe;
