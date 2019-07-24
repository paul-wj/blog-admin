const Router = require('koa-router');
const recipeModel = require('../controller/recipe');
let recipe = new Router();

recipe
	.get('/recipe', async ctx => recipeModel.getRecipeAllList(ctx))
	.get('/recipe-week', async ctx => recipeModel.getCurrentWeekRecipe(ctx))
;
module.exports = recipe;
