import { Format } from 'logform'
import winston from 'winston'

export interface ISchema {
  readonly format: Format
  readonly parse: (x: string) => any
}
export interface ILoggerOptions extends winston.LoggerOptions {
  readonly schema: ISchema
}

const match = (re: RegExp) => (s: string) => s.match(re),
  type = (a: any) =>
    a === null ? 'Null'
    : a === undefined ? 'Undefined'
    : Object.prototype.toString.call(a).slice(8, -1),
  anyPass = (preds: any[]) => (a: any) => preds.reduce((prev: boolean, pred: any) => prev || pred(a), false),
  replace = (pred: any, substitute: any, obj: any) =>
    // eslint-disable-next-line security/detect-object-injection
    Object.keys(obj).reduce((acc: any, key: string) => ({ ...acc, [ key ]: pred(key) ? substitute : obj[ key ] }), {}),
  censor = winston.format((info) =>
    type(info.message) !== 'Object' ? info
    : ({
      ...info,
      message: replace(anyPass([ match(/^authorization$/i), match(/^api-?key$/i) ]), '[REDACTED]', info.message),
    }))

export const
  defaultSchema: ISchema = {
    format: winston.format.combine(
      censor(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    parse: (x: string) =>
      Promise.resolve(x)
        .then(JSON.parse),
  },
  textSchema: ISchema = {
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.printf(({ level, message }) => `[${level}]: ${message}`)
    ),
    parse: (x: string) =>
      Promise.resolve(x)
        .then(match(/^\[([^\]]+)\]: (.*)/s))
        .then((result: string[] | null) => result || Promise.reject(new SyntaxError(`Could not parse log: ${x}`)))
        .then(([ , level, message ]) => ({ level, message })),
  },
  defaultOptions: winston.LoggerOptions = {
    level: 'info',
    format: defaultSchema.format,
    transports: [
      new winston.transports.Console(),
    ],
  },
  createLogger = ({ schema, ...rest }: ILoggerOptions) =>
    winston.createLogger({ ...defaultOptions, ...rest, format: schema.format })

export default createLogger({ schema: defaultSchema })
