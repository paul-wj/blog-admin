const Router = require('koa-router');
let router = new Router();

const user = require('./user');
const article = require('./article');
const tagCategory = require('./tag-category');
let routerList = [user, article, tagCategory];


routerList.forEach( currentRouter => {
	router.use(currentRouter.routes(), currentRouter.allowedMethods());
});
module.exports = router;
