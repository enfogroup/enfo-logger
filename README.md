# enfo-logger

A small wrapper made to assist with logging following our internal standard.

## Install
```
yarn add @enfo/enfo-logger
```

or

```
npm i @enfo/enfo-logger
```

## Usage
Using the `defaultSchema` which logs JSON.
```typescript
import logger from '@enfo/enfo-logger'

logger.info('my first log')
```

Using the `textSchema` which logs text.
```typescript
import { createLogger, textSchema } from '@enfo/enfo-logger'

const logger = createLogger({ schema: textSchema })
logger.info('my text log')
```

Making your own schema.
```typescript
import { createLogger } from '@enfo/enfo-logger'
import winston from 'winston'

const schema = {
    format: winston.format.printf(({ level, message }) => `LEVEL ${level}: ${message}`),
    parse: (x: string) =>
      Promise.resolve(x)
        .then((s: string) => s.match(/^LEVEL (.+?): (.*)/s))
        .then((result: string[] | null) => result || Promise.reject(new SyntaxError(`Could not parse log: ${x}`)))
        .then(([ , level, message ]) => ({ level, message })),
  }
const logger = createLogger({ schema })
logger.info('my custom log')

schema.parse('LEVEL info: my logged data')
// resolves to { level: 'info', message: 'my logged data' }
```

## License

enfo-logger is licensed under the terms of the MIT license.
