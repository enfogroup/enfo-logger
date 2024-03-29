/* eslint-disable fp/no-mutation */
/* eslint-disable import/no-commonjs */
/**
 * This file fixes an issue with dynamic requires present in logform.
 * Dynamic requires breaks certain builds
 */
const format = require('logform/format.js'),
  levels = require('logform/levels.js')

format.align = require('logform/align.js')
format.errors = require('logform/errors.js')
format.cli = require('logform/cli.js')
format.combine = require('logform/combine.js')
format.colorize = require('logform/colorize.js')
format.json = require('logform/json.js')
format.label = require('logform/label.js')
format.logstash = require('logform/logstash.js')
format.metadata = require('logform/metadata.js')
format.ms = require('logform/ms.js')
format.padLevels = require('logform/pad-levels.js')
format.prettyPrint = require('logform/pretty-print.js')
format.printf = require('logform/printf.js')
format.simple = require('logform/simple.js')
format.splat = require('logform/splat.js')
format.timestamp = require('logform/timestamp.js')
format.uncolorize = require('logform/uncolorize.js')

module.exports = { format, levels }
