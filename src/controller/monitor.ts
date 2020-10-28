import {
    request,
    summary,
    body,
    tagsAll,
    responses,
    query
} from 'koa-swagger-decorator/dist';
import {Context} from "koa";
import {OkPacket} from "mysql";
import {JoiSchemaToSwaggerSchema} from "../lib/utils";
import MonitorStatement from "../lib/statement/monitor";
import {ServerResponse, SuccessResponses} from "../types/response";
import {createMonitorWebPerformanceSchema} from "../lib/schemas/monitor";
import {getTokenResult} from "../middleware/verify-token";
import {WebPerformanceResponse} from "../types/monitor";
import {formatDate} from "../lib/utils";

const webPerformanceListResponse: SuccessResponses<WebPerformanceResponse> = {
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
                            id: {type: 'number', example: 'number', description: 'id'},
                            fpt: {type: 'number', example: 'number', description: '白屏时间'},
                            tti: {type: 'number', example: 'number', description: '首次可交互时间'},
                            ready: {type: 'number', example: 'number', description: 'HTML加载完成时间'},
                            loadTime: {type: 'number', example: 'number', description: '页面完全加载时间'},
                            firstbyte: {type: 'number', example: 'number', description: '首包时间'},
                            compressionRatio: {type: 'number', example: 'number', description: '压缩比例'},
                            type: {type: 'string', example: 'string', description: '页面打开方式'},
                            createTime: {type: 'string', example: 'string', description: '创建时间'},
                            dns: {type: 'number', example: 'number', description: 'DNS查询耗时'},
                            tcp: {type: 'number', example: 'number', description: 'TCP连接耗时'},
                            ttfb: {type: 'number', example: 'number', description: '请求响应耗时'},
                            trans: {type: 'number', example: 'number', description: '内容传输耗时'},
                            dom: {type: 'number', example: 'number', description: 'DOM解析耗时'},
                            res: {type: 'number', example: 'number', description: '资源加载耗时'},
                            sslTime: {type: 'number', example: 'number', description: 'SSL安全连接耗时'},
                            url: {type: 'string', example: 'string', description: '页面Url'},
                            userAgent: {type: 'string', example: 'string', description: '设备信息'},
                            ip: {type: 'string', example: 'string', description: '用户ip'},
                        }
                    }
                }
            }
        }
    }
};

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

    @request('get', '/monitor/web/performance')
    @summary('获取页面加载性能数据')
    @query({
        startTime: {type: 'string', required: false, description: '开始时间'},
        endTime: {type: 'string', required: false, description: '结束时间'},
    })
    @responses({...Monitor.defaultServerResponse, ...webPerformanceListResponse})
    static async getMonitorWebPerformanceData(ctx: Context): Promise<void> {
        const {query: {startTime, endTime}} = ctx;
        let response = {} as ServerResponse<WebPerformanceResponse[]>;
        let requestParams = {startTime: '', endTime: ''};
        if (startTime && endTime) {
            requestParams = {startTime: formatDate(startTime, 'YYYY/MM/DD HH:mm:ss'), endTime: formatDate(endTime, 'YYYY/MM/DD HH:mm:ss'),}
        }
        const performanceList: WebPerformanceResponse[] = await MonitorStatement.getWebPagePerformanceData(requestParams);
        if (performanceList && performanceList.length) {
            response = {code: 0, message: '成功', result: performanceList};
        } else {
            response = {code: 404, message: '资源不存在', result: null};
        }
        ctx.body = response;
    }
}
