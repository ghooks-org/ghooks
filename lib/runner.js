var spawn = require('spawn-command');
var resolve = require('path').resolve;

module.exports = function run (dirname, filename) {
  var command = commandFor(hook(dirname, filename));
  if (command) spawn(command, { stdio: 'inherit' }).on('exit', process.exit);
};

function hook (dirname, filename) {
  return filename.replace(dirname, '').substr(1);
}

function commandFor (hook) {
  var pkg = require(resolve(process.cwd(), 'package'));
  if (pkg.config && pkg.config.hooks && pkg.config.hooks[hook]) {
    return pkg.config.hooks[hook];
  }
}
