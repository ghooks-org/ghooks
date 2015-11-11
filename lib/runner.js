var clone = require('lodash.clone');
var managePath = require('manage-path');
var spawn = require('spawn-command');
var resolve = require('path').resolve;

module.exports = function run (dirname, filename, env) {
  var restorePath;
  var command = commandFor(hook(dirname, filename));
  if (command) runCommand(command, env);
};

function hook (dirname, filename) {
  return filename.replace(dirname, '').substr(1);
}

function commandFor (hook) {
  var pkg = require(resolve(process.cwd(), 'package'));
  if (pkg.config && pkg.config.ghooks && pkg.config.ghooks[hook]) {
    var command = pkg.config.ghooks[hook];

    // replace any instance of $1 or $2 etc. to that item as an process.argv
    return command.replace(/\$(\d)/g, function(match, number) {
      return process.argv[number];
    });
  }
}

function runCommand(command, env) {
  env = clone(env || process.env);
  var alterPath = managePath(env);
  alterPath.unshift(getNpmBin(process.cwd()));
  spawn(command, { stdio: 'inherit', env: env }).on('exit', process.exit);
}

function getNpmBin(dirname) {
  return resolve(dirname, 'node_modules', '.bin');
}
