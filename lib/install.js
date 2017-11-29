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
    const hooksDir = resolve(gitRoot, 'hooks')
    hooks.forEach(install.bind(null, hooksDir))
  } else {
    warnAboutGit()
  }
}

function findGitRoot() {
  try {
    return getGitRoot()
  } catch (e) {
    return null
  }
}

function getGitRoot() {
  const gitRoot = findup.sync(process.cwd(), '.git')
  const gitPath = resolve(gitRoot, '.git')
  const fileStat = fs.statSync(gitPath)
  return gitPathDir(gitPath, fileStat) || gitPathFile(gitPath, fileStat, gitRoot)
}

function gitPathDir(gitPath, fileStat) {
  return fileStat.isDirectory() ? gitPath : null
}

function gitPathFile(gitPath, fileStat, gitRoot) {
  return fileStat.isFile() ? parseGitFile(fileStat, gitPath, gitRoot) : null
}

function parseGitFile(fileStat, gitPath, gitRoot) {
  const gitDirRegex = /[^]{0,}gitdir: ([^\n]{1,})[^]{0,}/
  const gitFileContents = fs.readFileSync(gitPath, 'utf8')
  if (gitDirRegex.test(gitFileContents)) {
    return resolve(gitRoot, gitFileContents.replace(gitDirRegex, '$1'))
  }
  return null
}

function warnAboutGit() {
  console.warn( // eslint-disable-line no-console
    'This does not seem to be a git project.\n' +
    'Although ghooks was installed, the actual git hooks have not.\n' +
    'Run "git init" and then "npm explore ghooks -- npm run install".\n\n' +
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
  fs.renameSync(file, `${file}.bkp`)
}

function createExecutableHook(file) {
  fs.writeFileSync(file, template.content)
  fs.chmodSync(file, '755')
}

module.exports = installHooks
