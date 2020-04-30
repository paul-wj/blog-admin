import dayJs, {ConfigType} from 'dayjs';

export const formatDate = (time: ConfigType, timeFormat: string = 'YYYY-MM-DD HH:mm:ss') => time ? dayJs(time).format(timeFormat) : '';

export const html_encode = (str: string): string => {
    let result = '';
    if (!str) {
        return result;
    }
    result = str.replace(/&/g, "&amp;");
    result = result.replace(/</g, "&lt;");
    result = result.replace(/>/g, "&gt;");
    result = result.replace(/ /g, "&nbsp;");
    result = result.replace(/\'/g, "&#39;");
    result = result.replace(/\"/g, "&quot;");
    result = result.replace(/\n/g, "<br/>");
    return result;
};

export const html_decode = (str: string): string => {
    let result = '';
    if (!str) {
        return result;
    }
    result = str.replace(/&amp;/g, "&");
    result = result.replace(/&lt;/g, "<");
    result = result.replace(/&gt;/g, ">");
    result = result.replace(/&nbsp;/g, " ");
    result = result.replace(/&#39;/g, "\'");
    result = result.replace(/&quot;/g, "\"");
    result = result.replace(/<br\/>/g, "\n");
    return result;
};

export {default as query} from "./query";
export {JoiSchemaToSwaggerSchema} from './schemaToJoi';
