import {ISwaggerSchemaInfo} from './schema';

export interface ServerResponse<T = null> {
    code: number;
    message: string;
    result: T | null;
}

export type ResponseAllCode = '200' | '401' | '403' | '404';

export type ServerResponseAll<T = null> = Record<ResponseAllCode, {
    description: string,
    schema?: ISwaggerSchemaInfo & {
        properties: {
            code: ISwaggerSchemaInfo,
            message: ISwaggerSchemaInfo,
            result: ISwaggerSchemaInfo<T>
        }
    }
}>;

export type ServerSuccessResponsePageList<T> = Record<'200', {
    description: string,
    schema?: ISwaggerSchemaInfo & {
        properties: {
            code: ISwaggerSchemaInfo,
            message: ISwaggerSchemaInfo,
            result: ISwaggerSchemaInfo & {
                properties: {
                    items: ISwaggerSchemaInfo<T>,
                    total: ISwaggerSchemaInfo
                }
            }
        }
    }
}>;

export type SuccessResponses<T> = Pick<ServerResponseAll<T>, '200'>;

export type SqlPageListResponse<T> = [T[], [{total: number}]];

export type PageListResponse<T> = { items: T[], total: number };

export const defaultSuccessResponse: SuccessResponses<{}> = {
    200: {
        description: 'success',
        schema: {
            type: 'object',
            properties: {
                code: {type: 'number', example: 0, description: '状态码'},
                message: {type: 'string', example: '成功', description: '提示信息'},
                result: {type: 'null', example: 'null', description: '结果'},
            }
        }
    }
};

export const defaultServerResponse: ServerResponseAll = {
    ...defaultSuccessResponse,
    401: {description: 'Unauthorized'},
    403: {description: 'Forbidden'},
    404: {description: 'Not Found'},
};


