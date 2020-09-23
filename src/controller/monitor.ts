import {
    request,
    summary,
    body,
    tagsAll,
    responses,
} from 'koa-swagger-decorator/dist';
import {Context} from "koa";
import {OkPacket} from "mysql";
import {JoiSchemaToSwaggerSchema} from "../lib/utils";
import MonitorStatement from "../lib/statement/monitor";
import {ServerResponse} from "../types/response";
import {createMonitorWebPerformanceSchema} from "../lib/schemas/monitor";
import {getTokenResult} from "../middleware/verify-token";

@tagsAll(["性能监控API接口"])
export default class Monitor extends JoiSchemaToSwaggerSchema {
    @request('post', '/monitor/web/performance')
    @summary('上传web页面性能数据')
    @body({...Monitor.parseToSwaggerSchema(createMonitorWebPerformanceSchema)})
    @responses({...Monitor.defaultServerResponse})
    static async createMonitorWebPerformance(ctx: Context): Promise<void> {
        const {request: {body, header}} = ctx;
        let response = {code: 500, message: '上传失败', result: null} as ServerResponse;
        const [performanceEquipment, performanceInterval] = await Promise.all([MonitorStatement.createWebPerformanceEquipment({...body, ip: header.cip}), MonitorStatement.createWebPerformanceInterval(body)]);
        if (performanceEquipment && performanceEquipment.insertId && performanceInterval && performanceInterval.insertId) {
            const performance: OkPacket = await MonitorStatement.createWebPerformance(performanceEquipment.insertId, performanceInterval.insertId, {...body});
            if (performance && performance.insertId !== void 0) {
                response = {code: 0, message: '成功', result: null};
            }
        }
        ctx.body = response;
    }

    @request('post', '/monitor/web/performance-resource')
    @summary('上传web页面超时文件数据')
    @body({
        resourceList: {
            type: "array",
            items: {
                type: 'object',
                properties: {
                    name: {type: 'string', required: false, description: '文件名'},
                    encodedBodySize: {type: 'string', required: false, description: '压缩之后body大小'},
                    decodedBodySize: {type: 'string', required: false, description: '解压之后body大小'},
                    timeout: {type: 'string', required: false, description: '超时时间阀值'},
                    duration: {type: 'string', required: false, description: '请求总时间'},
                    protocol: {type: 'string', required: false, description: '请求资源的网络协议'},
                    type: {type: 'string', required: false, description: '发起资源的类型'},
                }
            }
        },
        url: {type: 'string', required: false, description: '页面Url'}
    })
    @responses({...Monitor.defaultServerResponse})
    static async createMonitorWebPerformanceResource(ctx: Context): Promise<void> {
        const {request: {body, header: {cip: ip}}} = ctx;
        const {resourceList, url, userAgent} = body;
        let response = {code: 500, message: '上传失败', result: null} as ServerResponse;
        const performanceEquipment = await MonitorStatement.createWebPerformanceEquipment({url, userAgent, ip});
        if (performanceEquipment && performanceEquipment.insertId) {
            const performanceResource = await MonitorStatement.createWebPerformanceResource(performanceEquipment.insertId, resourceList);
            if (performanceResource && performanceResource.insertId !== void 0) {
                response = {code: 0, message: '成功', result: null}
            }
        }
        ctx.body = response;
    }

    @request('post', '/monitor/web/error')
    @summary('上传web页面报错数据')
    @body({
        href: {type: 'string', required: false, description: '报错页面地址'},
        message: {type: 'string', required: false, description: '错误描述'},
        url: {type: 'string', required: false, description: '报错文件'},
        lineNum: {type: 'number', required: false, description: '报错行号'},
        columnNum: {type: 'number', required: false, description: '报错列号'},
        error: {type: 'string', required: false, description: '错误Error对象'}
    })
    @responses({...Monitor.defaultServerResponse})
    static async createMonitorWebError(ctx: Context): Promise<void> {
        const {request: {body, header: {cip: ip, 'refresh-token': refreshToken}}} = ctx;
        const {data: userInfo} = await getTokenResult(refreshToken);
        const userId = userInfo ? userInfo.id : null;
        const {userAgent, href, message, url, lineNum, columnNum, error} = body;
        let response = {code: 500, message: '上传失败', result: null} as ServerResponse;
        const equipment = await MonitorStatement.createWebPerformanceEquipment({url: href, userAgent, ip});
        if (equipment && equipment.insertId) {
            const pageError = await MonitorStatement.createWebPageError(userId, equipment.insertId, {href, message, url, lineNum, columnNum, error});
            if (pageError && pageError.insertId !== void 0) {
                response = {code: 0, message: '成功', result: null}
            }
        }
        ctx.body = response;
    }

    @request('post', '/monitor/web/error-resource')
    @summary('上传web页面引用文件报错数据')
    @body({
        href: {type: 'string', required: false, description: '资源引入报错页面地址'},
        src: {type: 'string', required: false, description: '报错文件地址'},
    })
    @responses({...Monitor.defaultServerResponse})
    static async createMonitorWebResourceError(ctx: Context): Promise<void> {
        const {request: {body, header: {cip: ip, 'refresh-token': refreshToken}}} = ctx;
        const {data: userInfo} = await getTokenResult(refreshToken);
        const userId = userInfo ? userInfo.id : null;
        const {userAgent, href, src} = body;
        let response = {code: 500, message: '上传失败', result: null} as ServerResponse;
        const equipment = await MonitorStatement.createWebPerformanceEquipment({url: href, userAgent, ip});
        if (equipment && equipment.insertId) {
            const pageResourceError = await MonitorStatement.createWebPageResourceError(userId, equipment.insertId, {href, src});
            if (pageResourceError && pageResourceError.insertId !== void 0) {
                response = {code: 0, message: '成功', result: null}
            }
        }
        ctx.body = response;
    }
}
