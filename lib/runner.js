const resolve = require('path').resolve
const basename = require('path').basename
const fs = require('fs')
const clone = require('lodash.clone')
const managePath = require('manage-path')
const spawn = require('spawn-command')
const findup = require('findup')

module.exports = function run(nodeModulesPath, filename, env) {
  const command = commandFor(nodeModulesPath, hook(filename))
  if (command) {
    runCommand(command, env)
  }
}

function hook(filename) {
  return basename(filename)
}

// replace any instance of $1 or $2 etc. to that item as an process.argv
function replacePositionalVariables(command) {
  return command.replace(/\$(\d)/g, (match, number) => {
    return process.argv[number]
  })
}

function commandFromPackage(packagePath, hookName) {
  const pkg = JSON.parse(fs.readFileSync(packagePath))
  if (pkg.config && pkg.config.ghooks && pkg.config.ghooks[hookName]) {
    return replacePositionalVariables(pkg.config.ghooks[hookName])
  } else {
    return null
  }
}

function commandFor(nodeModulesPath, hookName) {
  const pkgFile = findup.sync(nodeModulesPath, 'package.json')
  return commandFromPackage(resolve(pkgFile, 'package.json'), hookName)
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
