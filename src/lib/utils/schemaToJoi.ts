import {Schema, Description, ValidationOptions} from 'joi';
import {ISwaggerSchema} from "../../types/schema";
import {defaultServerResponse} from '../../types/response';
import {defaultHeaders} from '../../types/schema';

export class JoiSchemaToSwaggerSchema {
    static readonly defaultHeaders = defaultHeaders;
    static readonly defaultServerResponse = defaultServerResponse;

    static parseToSwaggerSchema(joiSchema?: Schema): ISwaggerSchema {
        const swaggerSchema: ISwaggerSchema = {};
        const joiDescription: Description = joiSchema.describe();
        const {type, children} = joiDescription;
        if (type === 'object') {
            for (let [joiTargetKey, joiTargetValue] of Object.entries(children as Record<string, Description>)) {
                let {type, flags, description} = joiTargetValue;
                if (type === 'alternatives') {
                    type = joiTargetValue.base.type;
                    description = joiTargetValue.base.description;
                }
                swaggerSchema[joiTargetKey] = {
                    type,
                    required: flags ? (flags as ValidationOptions).presence === 'required' : false,
                    description,
                }
            }
        }
        return swaggerSchema;
    }
}
