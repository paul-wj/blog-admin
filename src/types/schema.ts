import {SchemaLike, Types} from 'joi';

export type SchemaType = Types | string;

export type SchemaObject<T> = Record<keyof T, SchemaLike | SchemaLike[]>;

export interface ISwaggerSchemaInfo<T = null> {
    type: SchemaType;
    required?: boolean;
    description?: string;
    example?: any;
    properties?: Record<keyof T, ISwaggerSchemaInfo> | {
        items?: {
            type: SchemaType;
            items: ISwaggerSchemaInfo<T>
        },
    };
    items?: ISwaggerSchemaInfo & ISwaggerSchemaInfo<T>;
}

export type ISwaggerSchema = Record<string, ISwaggerSchemaInfo<{ authorization: string; refresh_token: string; }>>

export const defaultHeaders: ISwaggerSchema = {
    authorization: {type: 'string', required: true, description: '认证信息'},
    refresh_token: {type: 'string', required: true, description: '刷新认证信息'},
};


