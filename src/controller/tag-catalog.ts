import Joi, {ValidationResult} from 'joi';
import {Context} from "koa";
import {OkPacket} from 'mysql';
import {JoiSchemaToSwaggerSchema} from '../lib/utils';
import {ArticleInfo} from "../types/article";
import ArticleStatement from "../lib/statement/article";
import {CatalogInfo, CatalogRequestBody, TagInfo, TagRequestBody} from "../types/tag-catalog";
import TagCatalogStatement from '../lib/statement/tag-catalog';
import {createCatalogSchema, createTagSchema} from "../lib/schemas/tag-catalog";
import {
    ServerResponse,
    SuccessResponses,
    SqlPageListResponse,
    PageListResponse,
    ServerSuccessResponsePageList
} from '../types/response';
import {
    request,
    summary,
    body,
    path,
    query,
    tagsAll,
    responses,
    header
} from 'koa-swagger-decorator/dist';
import {getTokenResult} from "../middleware/verify-token";

const tagAllListResponse: SuccessResponses<TagInfo> = {
    200: {
        description: 'success',
        schema: {
            type: 'object',
            properties: {
                code: {type: 'number', example: 0, description: '状态码'},
                message: {type: 'string', example: '成功', description: '提示信息'},
                result: {
                    type: "array",
                    items: {
                        type: 'object',
                        properties: {
                            id: {type: 'number', example: 'number', description: '标签id'},
                            name: {type: 'string', example: 'string', description: '标签名'},
                            userId: {type: 'number', example: 'number', description: '用户id'},
                            createTime: {type: 'string', example: 'string', description: '创建时间'},
                            updateTime: {type: 'string', example: 'string', description: '更新时间'},
                            color: {type: 'string', example: 'string', description: '标签颜色'},
                            counts: {type: 'number', example: 'number', description: '标签文章数量'},
                        }
                    }
                }
            }
        }
    }
};

@tagsAll(["系统目录标签API接口"])
export default class TagCatalog extends JoiSchemaToSwaggerSchema {
    @request('post', '/tag')
    @summary('新增标签')
    @header(TagCatalog.defaultHeaders)
    @body({...TagCatalog.parseToSwaggerSchema(createTagSchema)})
    @responses({...TagCatalog.defaultServerResponse})
    static async createTag(ctx: Context): Promise<void> {
        const {header: {refresh_token}, request: {body}} = ctx;
        const {data: userInfo} = await getTokenResult(refresh_token);
        let response = {} as ServerResponse;
        if (!userInfo) {
            ctx.body = response = {...response, code: 400, message: '用户未登录', result: null};
            return
        }
        const {name, color} = body;
        const validator: ValidationResult<TagRequestBody> = Joi.validate({name, color}, createTagSchema);
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const newTag: OkPacket = await TagCatalogStatement.createTag({...body, userId: userInfo.id});
        if (newTag && newTag.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('patch', '/tag/:id')
    @summary('编辑标签信息')
    @header(TagCatalog.defaultHeaders)
    @path({
        id: {type: 'number', description: '标签id'}
    })
    @body({...TagCatalog.parseToSwaggerSchema(createTagSchema)})
    @responses({...TagCatalog.defaultServerResponse})
    static async editTag(ctx: Context): Promise<void> {
        const {params: {id}, header: {refresh_token}, request: {body}} = ctx;
        let response = {} as ServerResponse;
        const [currentTag,] = await TagCatalogStatement.getTagById(id);
        const {name, color} = body;
        const validator = Joi.validate({name, color}, createTagSchema);
        if (validator.error) {
            ctx.body = response = {code: 400, message: validator.error.message, result: null};
            return
        }
        const {data: userInfo} = getTokenResult(refresh_token);
        if (currentTag.userId !== userInfo.id) {
            ctx.body = response = {code: 400, message: '不能编辑他人创建标签', result: null};
            return
        }
        const editTag: OkPacket = await TagCatalogStatement.editTag(id, body);
        if (editTag && editTag.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/tag/all')
    @summary('获取所有标签列表')
    @responses({...TagCatalog.defaultServerResponse, ...tagAllListResponse})
    static async getTagAllList(ctx: Context): Promise<void> {
        let response = {} as ServerResponse<TagInfo[]>;
        const tagList: TagInfo[] = await TagCatalogStatement.getTagAllList();
        const articleAllList: ArticleInfo[] = await ArticleStatement.getArticleAllList();
        if (tagList && tagList.length) {
            tagList.forEach((tagInfo: TagInfo) => {
                tagInfo.counts = articleAllList.filter((article: ArticleInfo) => (article.tagIds as string).split(',').includes(String(tagInfo.id))).length;
            });
            response = {code: 0, message: '成功', result: tagList};
        } else {
            response = {code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('delete', '/tag/:id')
    @summary('删除标签')
    @header(TagCatalog.defaultHeaders)
    @path({
        id: {type: 'number', description: '标签id'}
    })
    @responses({...TagCatalog.defaultServerResponse})
    static async deleteTag(ctx: Context): Promise<void> {
        const {params: {id}, header: {refresh_token}} = ctx;
        let response = {} as ServerResponse;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '标签id不存在', result: null};
            return
        }
        const [currentTag,] = await TagCatalogStatement.getTagById(id);
        const {data: userInfo} = getTokenResult(refresh_token);
        if (currentTag.userId !== userInfo.id) {
            ctx.body = response = {code: 400, message: '不能编辑他人创建标签', result: null};
            return
        }
        const queryResult: OkPacket = await TagCatalogStatement.deleteTag(id);
        if (queryResult && queryResult.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('get', '/category/all')
    @summary('获取所有目录列表')
    @responses({...TagCatalog.defaultServerResponse, ...tagAllListResponse})
    static async getCatalogAllList(ctx: Context): Promise<void> {
        let response = {} as ServerResponse<CatalogInfo[]>;
        const catalogList: CatalogInfo[] = await TagCatalogStatement.getCategoryAllList();
        const articleAllList: ArticleInfo[] = await ArticleStatement.getArticleAllList();
        if (catalogList && catalogList.length) {
            catalogList.forEach((catalogInfo: CatalogInfo) => {
                catalogInfo.counts = articleAllList.filter((article: ArticleInfo) => (article.categories as string).split(',').includes(String(catalogInfo.id))).length;
            });
            response = {code: 0, message: '成功', result: catalogList};
        } else {
            response = {code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }

    @request('post', '/category')
    @summary('新增目录')
    @header(TagCatalog.defaultHeaders)
    @body({...TagCatalog.parseToSwaggerSchema(createCatalogSchema)})
    @responses({...TagCatalog.defaultServerResponse})
    static async createCatalog(ctx: Context): Promise<void> {
        const {header: {refresh_token}, request: {body}} = ctx;
        const {data: userInfo} = await getTokenResult(refresh_token);
        let response = {} as ServerResponse;
        if (!userInfo) {
            ctx.body = response = {...response, code: 400, message: '用户未登录', result: null};
            return
        }
        const {name} = body;
        const validator: ValidationResult<CatalogRequestBody> = Joi.validate({name}, createCatalogSchema);
        if (validator.error) {
            ctx.body = response = {...response, code: 400, message: validator.error.message};
            return
        }
        const newCatalog: OkPacket = await TagCatalogStatement.createCategory({name, userId: userInfo.id});
        if (newCatalog && newCatalog.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('patch', '/category/:id')
    @summary('编辑目录信息')
    @header(TagCatalog.defaultHeaders)
    @path({
        id: {type: 'number', description: '目录id'}
    })
    @body({...TagCatalog.parseToSwaggerSchema(createCatalogSchema)})
    @responses({...TagCatalog.defaultServerResponse})
    static async editCatalog(ctx: Context): Promise<void> {
        const {params: {id}, header: {refresh_token}, request: {body}} = ctx;
        let response = {} as ServerResponse;
        const [currentCatalog,] = await TagCatalogStatement.getCategoryById(id);
        const {name} = body;
        const validator = Joi.validate({name}, createCatalogSchema);
        if (validator.error) {
            ctx.body = response = {code: 400, message: validator.error.message, result: null};
            return
        }
        const {data: userInfo} = getTokenResult(refresh_token);
        if (currentCatalog.userId !== userInfo.id) {
            ctx.body = response = {code: 400, message: '不能编辑他人创建目录', result: null};
            return
        }
        const editTag: OkPacket = await TagCatalogStatement.editCategory(id, {name});
        if (editTag && editTag.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }

    @request('delete', '/category/:id')
    @summary('删除目录')
    @header(TagCatalog.defaultHeaders)
    @path({
        id: {type: 'number', description: '目录id'}
    })
    @responses({...TagCatalog.defaultServerResponse})
    static async deleteCatalog(ctx: Context): Promise<void> {
        const {params: {id}, header: {refresh_token}} = ctx;
        let response = {} as ServerResponse;
        if (!id) {
            ctx.body = response = {...response, code: 400, message: '目录id不存在', result: null};
            return
        }
        const [currentTag,] = await TagCatalogStatement.getTagById(id);
        const {data: userInfo} = getTokenResult(refresh_token);
        if (currentTag.userId !== userInfo.id) {
            ctx.body = response = {code: 400, message: '不能编辑他人创建目录', result: null};
            return
        }
        const queryResult: OkPacket = await TagCatalogStatement.deleteCategory(id);
        if (queryResult && queryResult.insertId !== void 0) {
            response = {code: 0, message: '成功', result: null};
        }
        ctx.body = response;
    }
}
