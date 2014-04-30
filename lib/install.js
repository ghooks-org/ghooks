module.exports = installHooks;

var fs = require('fs');
var cwd = process.cwd();
var resolve = require('path').resolve;
var projectRoot = resolve(cwd.replace(/node_modules\/.*/, ''));
var hookContent = fs.readFileSync(resolve(projectRoot, 'node_modules/ghooks/lib/hook.template'), 'UTF-8');

var hooks = [
  'post-update',
  'pre-applypatch',
  'pre-commit',
  'pre-push',
  'pre-rebase',
  'update'
];

function installHooks () {
  if (isGitProject()) { hooks.forEach(install); }
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
  var hookFileExists = fs.existsSync(file);
  var hookBackupFileExists = !fs.existsSync(backupFile(file));
  if (hookFileExists && !hookBackupFileExists) { backup(file); }
  fs.writeFileSync(file, hookContent);
  fs.chmodSync(file, '755');
}

function backupFile (file) {
  return file + '.bkp';
}

function backup (file) {
  fs.renameSync(file, backupFile(file));
}

function hookFile (name) {
  return resolve(projectRoot, '.git/hooks', name);
}
