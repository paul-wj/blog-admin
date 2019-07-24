const Router = require('koa-router');
let router = new Router();

const user = require('./user');
const article = require('./article');
const tagCategory = require('./tag-category');
const statistics = require('./statistics');
const recipe = require('./recipe');
let routerList = [user, article, tagCategory, statistics, recipe];


routerList.forEach( currentRouter => {
	router.use(currentRouter.routes(), currentRouter.allowedMethods());
});
module.exports = router;
