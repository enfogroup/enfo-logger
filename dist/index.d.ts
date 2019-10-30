import { Format } from 'logform';
import winston from 'winston';
export interface ISchema {
    readonly format: Format;
    readonly parse: (x: string) => any;
}
export interface ILoggerOptions extends winston.LoggerOptions {
    readonly schema: ISchema;
}
export declare const defaultSchema: ISchema, textSchema: ISchema, defaultOptions: winston.LoggerOptions, createLogger: ({ schema, ...rest }: ILoggerOptions) => winston.Logger;
declare const _default: winston.Logger;
export default _default;
