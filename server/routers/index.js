const Router = require('koa-router');
let router = new Router();

const user = require('./user');
let routerList = [user];


routerList.forEach( currentRouter => {
	router.use(currentRouter.routes(), currentRouter.allowedMethods());
});
module.exports = router;
