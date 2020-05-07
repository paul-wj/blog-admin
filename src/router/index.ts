import path from 'path';
import {SwaggerRouter} from "koa-swagger-decorator/dist";

export const koaRouterOpts = {prefix: ''};
const swaggerRouterOpts = {
    title: "Paul Blog 后台接口文档",
    description: "后台接口文档",
    version: "1.0.0",
};

const router = new SwaggerRouter(koaRouterOpts, swaggerRouterOpts);

router.swagger();

router.mapDir(path.resolve(__dirname, '../controller'), {
    ignore: [path.resolve(__dirname, '../controller/index.ts')],
    doValidation: false
});

export default router;
