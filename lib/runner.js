const castArray = require('lodash.castarray')
const clone = require('lodash.clone')
const get = require('lodash.get')
const managePath = require('manage-path')
const spawn = require('spawn-command')
const {resolve, basename} = require('path')
const findup = require('findup')
const fs = require('fs')

module.exports = function run(nodeModulesPath, filename, env) {
  const commands = commandsFor(nodeModulesPath, hook(filename))
  runCommands(commands, env)
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

function commandsFromPackage(packagePath, hookName) {
  const pkg = JSON.parse(fs.readFileSync(packagePath))
  const hookConfig = get(pkg, `config.ghooks.${hookName}`, [])
  const filePaths = castArray(hookConfig)
  return filePaths.map(filePath => replacePositionalVariables(filePath))
}

function commandsFor(nodeModulesPath, hookName) {
  const pkgFile = findup.sync(nodeModulesPath, 'package.json')
  return commandsFromPackage(resolve(pkgFile, 'package.json'), hookName)
}

function runCommands(commands, env) {
  env = clone(env || process.env)
  const alterPath = managePath(env)
  alterPath.unshift(getNpmBin(process.cwd()))
  commands.forEach(command => spawn(command, {stdio: 'inherit', env}).on('exit', process.exit))
}

function getNpmBin(dirname) {
  return resolve(dirname, 'node_modules', '.bin')
}
