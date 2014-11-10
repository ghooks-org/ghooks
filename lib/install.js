module.exports = installHooks;

var fs = require('fs');
var cwd = process.cwd();
var resolve = require('path').resolve;
var projectRoot = resolve(cwd.replace(/node_modules\/.*/, ''));
var hooksDir = resolve(projectRoot, '.git/hooks');
var template = require('./hook.template');

var hooks = [
  'post-update',
  'pre-applypatch',
  'pre-commit',
  'pre-push',
  'pre-rebase',
  'update',
  'commit-msg'
];

function installHooks () {
  if (isGitProject()) {
    ensureHooksDirExists();
    hooks.forEach(install);
  }
  else { warnAboutGit(); }
}

function isGitProject () {
  return fs.existsSync(resolve(projectRoot, '.git'));
}

function warnAboutGit () { console.warn(
  'This does not seem to be a git project.\n' +
  'Although ghooks was installed, the actual git hooks have not.\n' +
  'Please run "git init" and then "npm run ghooks install".\n'
);}

function install(hook) {
  var file = hookFile(hook);
  if (needsBackup(file)) { backup(file); }
  fs.writeFileSync(file, template.content);
  fs.chmodSync(file, '755');
}

function needsBackup (file) {
  return fs.existsSync(file) && !generatedByGHooks(file);
}

function generatedByGHooks (file) {
  return !!fs.readFileSync(file, 'UTF-8').match(template.generatedMessage);
}

function backup (file) {
  fs.renameSync(file, file + '.bkp');
}

function hookFile (name) {
  return resolve(hooksDir, name);
}

function ensureHooksDirExists () {
  if (!fs.existsSync(hooksDir)) { fs.mkdirSync(hooksDir); }
}
