const Router = require('koa-router');
const tagCategoryModel = require('../controller/tag-category');
let tagCategory = new Router();

tagCategory
	.post('/tag', async ctx => tagCategoryModel.createTag(ctx))
	.patch('/tag/:id', async ctx => tagCategoryModel.editTag(ctx))
	.get('/tag', async ctx => tagCategoryModel.getTagAllList(ctx))
	.delete('/tag/:id', async ctx => tagCategoryModel.deleteTag(ctx))
	.get('/category', async ctx => tagCategoryModel.getCategoryAllList(ctx))
	.post('/category', async ctx => tagCategoryModel.createCategory(ctx))
	.patch('/category/:id', async ctx => tagCategoryModel.editCategory(ctx))
	.delete('/category/:id', async ctx => tagCategoryModel.deleteCategory(ctx))
;
module.exports = tagCategory;
