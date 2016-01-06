module.exports = installHooks;

var fs = require('fs');
var cwd = process.cwd();
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

function findGitRoot (directory) {
  try {
    return findup.sync(directory || cwd, '.git');
  } catch(e) {
    return null;
  }
}

function installHooks (directory) {
  var gitRoot = findGitRoot(directory);
  if (gitRoot) {
    var hooksDir = resolve(gitRoot, '.git/hooks');
    ensureHooksDirExists(hooksDir);
    hooks.forEach(install.bind(null, hooksDir));
  }
  else { warnAboutGit(); }
}

function warnAboutGit () { console.warn(
  'This does not seem to be a git project.\n' +
  'Although ghooks was installed, the actual git hooks have not.\n' +
  'Run "git init" and then "npm run ghooks install".\n\n' +
  'Please ignore this message if you are not using ghooks directly.'
);}

function install(hooksDir, hook) {
  var file = hookFile(hooksDir, hook);
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

function hookFile (hooksDir, name) {
  return resolve(hooksDir, name);
}

function ensureHooksDirExists (hooksDir) {
  if (!fs.existsSync(hooksDir)) { fs.mkdirSync(hooksDir); }
}
