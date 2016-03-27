const fs = require('fs')
const resolve = require('path').resolve
const findup = require('findup')
const template = require('./hook.template')

const hooks = [
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

function installHooks() {
  const gitRoot = findGitRoot()
  if (gitRoot) {
    const hooksDir = resolve(gitRoot, '.git/hooks')
    hooks.forEach(install.bind(null, hooksDir))
  } else {
    warnAboutGit()
  }
}

function findGitRoot() {
  try {
    return findup.sync(process.cwd(), '.git')
  } catch (e) {
    return null
  }
}

function warnAboutGit() {
  console.warn( // eslint-disable-line no-console
    'This does not seem to be a git project.\n' +
    'Although ghooks was installed, the actual git hooks have not.\n' +
    'Run "git init" and then "npm run ghooks install".\n\n' +
    'Please ignore this message if you are not using ghooks directly.'
  )
}

function install(dir, hook) {
  ensureDirExists(dir)
  const file = resolve(dir, hook)
  needsBackup(file) && backup(file)
  createExecutableHook(file)
}

function ensureDirExists(dir) {
  fs.existsSync(dir) || fs.mkdirSync(dir)
}

function needsBackup(file) {
  return fs.existsSync(file) && !generatedByGHooks(file)
}

function generatedByGHooks(file) {
  return !!fs.readFileSync(file, 'UTF-8').match(template.generatedMessage)
}

function backup(file) {
  fs.renameSync(file, file + '.bkp')
}

function createExecutableHook(file) {
  fs.writeFileSync(file, template.content)
  fs.chmodSync(file, '755')
}

module.exports = installHooks
