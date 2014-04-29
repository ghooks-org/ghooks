module.exports = installHooks;

var fs = require('fs');
var cwd = process.cwd();
var resolve = require('path').resolve;
var hookContent = fs.readFileSync(resolve(cwd, 'lib', 'hook.content'), 'utf8');

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
  return fs.existsSync(resolve(cwd, '.git'));
}

function warnAboutGit () { console.warn(
  'This does not seem to be a git project.\n' +
  'Although ghooks was installed, the actual git hooks have not.\n' +
  'Please run "git init" and then "npm run ghooks install".'
);}

function install(hook) {
  var file = hookFile(hook);
  if (fs.existsSync(file)) { backup(file); }
  fs.writeFileSync(file, hookContent);
  fs.chmodSync(file, '755');
}

function backup (file) {
  fs.renameSync(file, file + '.bkp');
}

function hookFile (name) {
  return resolve(cwd, '.git', 'hooks', name);
}
