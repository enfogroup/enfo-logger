/* global describe, expect, it, jest */
/* eslint-disable better/explicit-return, fp/no-unused-expression, fp/no-nil */
import Transport from 'winston-transport'
import log, { createLogger, defaultSchema, textSchema, jsonPrettyPrintSchema } from '../src/index'

// eslint-disable-next-line fp/no-class
class TestTransport extends Transport {
  logs: string[]
  constructor () {
    super()
    // eslint-disable-next-line fp/no-this, fp/no-mutation
    this.logs = []
  }
  log (info: any, callback: any) {
    // eslint-disable-next-line fp/no-this, fp/no-mutating-methods
    this.logs.push(info[ Symbol.for('message') ])
    callback()
  }
  getLogs () {
    // eslint-disable-next-line fp/no-this
    return this.logs
  }
}

describe('index', () => {
  describe('log', () => {
    it('log.info should be a function', () => {
      expect(typeof log.info).toBe('function')
    })
  })
  describe('createLogger', () => {
    it('createLogger should be a function', () => {
      expect(typeof createLogger).toBe('function')
    })
  })
  describe('defaultSchema', () => {
    it('logs JSON', () => {
      const transport = new TestTransport(),
        logger = createLogger({ schema: defaultSchema, transports: [ transport ] })
      logger.info('my test log')
      expect(transport.getLogs()).toEqual([ '{"message":"my test log","level":"info"}' ])
    })
    it('handles objects', () => {
      const transport = new TestTransport(),
        logger = createLogger({ schema: defaultSchema, transports: [ transport ] })
      logger.info({ my: 'object' })
      expect(transport.getLogs()).toEqual([ '{"message":{"my":"object"},"level":"info"}' ])
    })
    it('removes authorization', () => {
      const transport = new TestTransport(),
        logger = createLogger({ schema: defaultSchema, transports: [ transport ] })
      logger.info({ my: 'object', authorization: 'should not be logged' })
      expect(transport.getLogs()).toEqual([ '{"message":{"my":"object","authorization":"[REDACTED]"},"level":"info"}' ])
    })
    it('removes apiKey', () => {
      const transport = new TestTransport(),
        logger = createLogger({ schema: defaultSchema, transports: [ transport ] })
      logger.info({ my: 'object', apiKey: 'should not be logged' })
      expect(transport.getLogs()).toEqual([ '{"message":{"my":"object","apiKey":"[REDACTED]"},"level":"info"}' ])
    })
    it('removes api-key', () => {
      const transport = new TestTransport(),
        logger = createLogger({ schema: defaultSchema, transports: [ transport ] })
      logger.info({ my: 'object', 'api-key': 'should not be logged' })
      expect(transport.getLogs()).toEqual([ '{"message":{"my":"object","api-key":"[REDACTED]"},"level":"info"}' ])
    })
    it('handles Error', () => {
      const transport = new TestTransport(),
        logger = createLogger({ schema: defaultSchema, transports: [ transport ] })
      logger.info(new Error('some-message'))
      expect(transport.getLogs()[ 0 ].startsWith('{"level":"info","message":"some-message","stack":"Error: some-message')).toBe(true)
    })
    it('parses JSON', () => {
      expect(defaultSchema.parse('{"message":"my test log","level":"info"}')).resolves.toEqual({ message: 'my test log', level: 'info' })
    })
  })
  describe('jsonPrettyPrintSchema', () => {
    it('logs pretty JSON', () => {
      const transport = new TestTransport(),
        logger = createLogger({ schema: jsonPrettyPrintSchema, transports: [ transport ] })
      logger.info('my test log')
      expect(transport.getLogs()).toEqual([ '{\n  "message": "my test log",\n  "level": "info"\n}' ])
    })
    it('parses pretty JSON', () => {
      expect(jsonPrettyPrintSchema.parse('{\n  "message": "my test log",\n  "level": "info"\n}')).resolves.toEqual({ message: 'my test log', level: 'info' })
    })
  })
  describe('textSchema', () => {
    it('logs text', () => {
      const transport = new TestTransport(),
        logger = createLogger({ schema: textSchema, transports: [ transport ] })
      logger.info('my test log')
      expect(transport.getLogs()).toEqual([ '[info]: my test log' ])
    })
    it('parses text', () => {
      expect(textSchema.parse('[info]: my test log')).resolves.toEqual({ message: 'my test log', level: 'info' })
    })
    it('parses multi-line text', () => {
      expect(textSchema.parse('[info]: my test log\n\tline2')).resolves.toEqual({ message: 'my test log\n\tline2', level: 'info' })
    })
  })
})
