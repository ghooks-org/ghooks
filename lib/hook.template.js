const fs = require('fs')
const resolve = require('path').resolve
const join = require('path').join

const generatedMessage = require('./message.template.js').generatedMessage

exports.content = fs
  .readFileSync(resolve(`${__dirname}/hook.template.raw`), 'UTF-8')
  .replace('{{generated_message}}', generatedMessage)
  .replace('{{node_modules_path}}', join(process.cwd(), '..').replace(/\\/g, '\\\\'))
