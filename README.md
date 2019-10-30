# enfo-logger

A small wrapper made to assist with logging following our internal standard.

## Install
```
yarn add winston @enfo/enfo-logger
```

or

```
npm i winston @enfo/enfo-logger
```

## Usage
Using the `defaultSchema` which logs JSON.
```typescript
import logger from '@enfo/enfo-logger'

logger.info('my first log')
// {"message":"my first log","level":"info"}
```

Using the `textSchema` which logs text.
```typescript
import { createLogger, textSchema } from '@enfo/enfo-logger'

const logger = createLogger({ schema: textSchema })
logger.info('my text log')
// [info]: my text log
```

Making your own schema.
```typescript
import { createLogger } from '@enfo/enfo-logger'
import R from 'ramda'
import winston from 'winston'

const schema = {
    format: winston.format.printf(({ level, message }) => `LEVEL ${level}: ${message}`),
    parse: (x: string) =>
      Promise.resolve(x)
        .then(R.match(/^LEVEL (.+?): (.*)/s))
        .then(R.when(
          R.isNil,
          () => Promise.reject(new SyntaxError(`Could not parse log: ${x}`))))
        .then(([ , level, message ]) => ({ level, message }))
  }
const logger = createLogger({ schema })
logger.info('my custom log')
// LEVEL info: my custom log

schema.parse('LEVEL info: my logged data')
// resolves to { level: 'info', message: 'my logged data' }
```

## Developing

1. Clone the repo
1. Run `yarn install`
1. Run `yarn test-watch` to run the tests while deving
1. Run `yarn build` to build

Lint checks and tests are run automatically on commit and built by the pipeline on push.

## License

enfo-logger is licensed under the terms of the MIT license.
