import Joi from 'joi';
import { SchemaObject } from '../../types/schema';
import { TagRequestBody, CatalogRequestBody } from "../../types/tag-catalog";

const createTagSchemaObj: SchemaObject<TagRequestBody> = {
    name: Joi.string().description('标签名').required().error(new Error('标签名不能为空')),
    color: Joi.string().description('标签颜色').required().error(new Error('标签颜色不能为空')),
};
export const createTagSchema = Joi.object().keys(createTagSchemaObj);

const createCatalogSchemaObj: SchemaObject<CatalogRequestBody> = {
    name: Joi.string().description('标签名').required().error(new Error('标签名不能为空')),
};
export const createCatalogSchema = Joi.object().keys(createCatalogSchemaObj);
