module.exports = installHooks;

var fs = require('fs');
var resolve = require('path').resolve;
var findup = require('findup');
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
  var gitRoot = findGitRoot();
  if (gitRoot) {
    var hooksDir = resolve(gitRoot, '.git/hooks');
    hooks.forEach(install.bind(null, hooksDir));
  }
  else { warnAboutGit(); }
}

function findGitRoot () {
  try { return findup.sync(process.cwd(), '.git'); }
  catch(e) { return null; }
}

function warnAboutGit () { console.warn(
  'This does not seem to be a git project.\n' +
  'Although ghooks was installed, the actual git hooks have not.\n' +
  'Run "git init" and then "npm run ghooks install".\n\n' +
  'Please ignore this message if you are not using ghooks directly.'
);}

function install(dir, hook) {
  ensureDirExists(dir);
  var file = resolve(dir, hook);
  if (needsBackup(file)) { backup(file); }
  createExecutableHook(file);
}

function ensureDirExists (dir) {
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir); }
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

function createExecutableHook (file) {
  fs.writeFileSync(file, template.content);
  fs.chmodSync(file, '755');
}
