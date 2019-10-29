import { Format } from 'logform'
import winston from 'winston'

export interface ISchema {
  readonly format: Format
  readonly parse: (x: string) => any
}
export interface ILoggerOptions extends winston.LoggerOptions {
  readonly schema: ISchema
}

const match = (re: RegExp) => (s: string) => s.match(re)

export const
  defaultSchema: ISchema = {
    format: winston.format.combine(
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
  createLogger = ({ schema, ...rest }: any) =>
    winston.createLogger({ ...defaultOptions, ...rest, format: schema.format })

export default createLogger({ schema: defaultSchema })
