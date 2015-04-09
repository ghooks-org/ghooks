module.exports = installHooks;

var fs = require('fs');
var cwd = process.cwd();
var resolve = require('path').resolve;
var projectRoot = cwd.replace(/node_modules(?!.*node_modules(\/|\\|$)).*/, '');
projectRoot = resolve(projectRoot);
var hooksDir = resolve(projectRoot, '.git/hooks');
var template = require('./hook.template');

var hooks = [
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
  'Run "git init" and then "npm run ghooks install".\n\n' +
  'Please ignore this message if you are not using ghooks directly.'
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
