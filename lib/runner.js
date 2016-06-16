const clone = require('lodash.clone')
const managePath = require('manage-path')
const spawn = require('spawn-command')
const resolve = require('path').resolve
const config = require('./config').getConfig()

module.exports = function run(dirname, filename, env) {
  const command = commandFor(hook(dirname, filename))
  if (command) {
    runCommand(command, env)
  }
}

function hook(dirname, filename) {
  return filename.replace(dirname, '').substr(1)
}

// replace any instance of $1 or $2 etc. to that item as an process.argv
function replacePositionalVariables(command) {
  return command.replace(/\$(\d)/g, (match, number) => {
    return process.argv[number]
  })
}

function commandFor(hookName) {
  if (config.hooks[hookName]) {
    const command = config.hooks[hookName]
    return replacePositionalVariables(command)
  } else {
    return null
  }
}

function runCommand(command, env) {
  env = clone(env || process.env)
  const alterPath = managePath(env)
  alterPath.unshift(getNpmBin(process.cwd()))
  spawn(command, {stdio: 'inherit', env}).on('exit', process.exit)
}

function getNpmBin(dirname) {
  return resolve(dirname, 'node_modules', '.bin')
}
