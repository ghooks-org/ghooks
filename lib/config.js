const fs = require('fs')
const resolve = require('path').resolve

const findup = require('findup')
const clone = require('lodash.clone')
const defaultsDeep = require('lodash.defaultsdeep')
const pick = require('lodash.pick')

const availableHooks = [
  'applypatch-msg',
  'pre-applypatch',
  'post-applypatch',
  'pre-commit',
  'prepare-commit-msg',
  'commit-msg',
  'post-commit',
  'pre-rebase',
  'post-checkout',
  'post-merge',
  'pre-push',
  'pre-receive',
  'update',
  'post-receive',
  'post-update',
  'pre-auto-gc',
  'post-rewrite',
]

const defaultConfig = {
  exitWithError: false,
}

const getPackageConfig = (function getPackageConfigCurried() {
  const pkg = getPackage()
  return () => pkg.config || {}
})()

function getPackage() {
  const pkgFile = findup.sync(process.cwd(), 'package.json')
  return JSON.parse(fs.readFileSync(resolve(pkgFile, 'package.json')))
}

function getHooks() {
  return clone(availableHooks)
}

function getDefaultConfig() {
  return clone(defaultConfig)
}

function getConfiguredHooks(hooksConfig) {
  const result = pick(hooksConfig || {}, availableHooks)
  return result
}

function pickDeprecatedConfigOption(configuredOptions, option, availableOptions, config) {
  const deprecatedOption = `ghooks-${option}`
  if (config.hasOwnProperty(deprecatedOption)) {
    configuredOptions[option] = config[deprecatedOption]
  }
}

function getDeprecatedConfigOptions(config) {
  const availableOptions = Object.keys(defaultConfig)
  const configuredOptions = {}
  for (const option of availableOptions) {
    pickDeprecatedConfigOption(configuredOptions, option, availableOptions, config)
  }
  return configuredOptions
}

function getConfiguredOptions(config) {
  const availableOptions = Object.keys(defaultConfig)
  return pick(config, availableOptions)
}

function getDeprecatedConfig() {
  const pkgConfig = getPackageConfig()
  const hooks = getConfiguredHooks(pkgConfig.ghooks)
  const options = getDeprecatedConfigOptions(pkgConfig)
  return {hooks, ...options}
}

function getCurrentConfig() {
  const pkgConfig = getPackageConfig()
  const ghooksConfig = pkgConfig.ghooks || {}
  const hooks = getConfiguredHooks(ghooksConfig.hooks)
  const options = getConfiguredOptions(ghooksConfig)
  return {hooks, ...options}
}

function getConfig() {
  const result = defaultsDeep({}, getCurrentConfig(), getDeprecatedConfig(), getDefaultConfig())
  return result
}

module.exports = {getHooks, getDefaultConfig, getConfig}
