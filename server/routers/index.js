const Router = require('koa-router');
let router = new Router();

const user = require('./user');
const article = require('./article');
let routerList = [user, article];


routerList.forEach( currentRouter => {
	router.use(currentRouter.routes(), currentRouter.allowedMethods());
});
module.exports = router;
