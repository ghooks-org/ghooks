var spawn = require('spawn-command');
var resolve = require('path').resolve;
var basename = require('path').basename;
var gitroot = require('./gitroot')();

module.exports = function run (filename) {
  var command = commandFor(hook(filename));
  if (command) spawn(command, { stdio: 'inherit' }).on('exit', process.exit);
};

function hook (filename) {
  return basename(filename);
}

function commandFor (hook) {
  var pkg = getPackageJson();
  if (pkg.config && pkg.config.ghooks && pkg.config.ghooks[hook]) {
    return pkg.config.ghooks[hook];
  }
}

function getPackageJson () {
	var pkg;
	try {
		// Attempt to get package.json from the consumers project dir
		pkg = require(resolve(__dirname,  '../../../package'));
	}
	catch (e) {
		// Consumers project dir doesn't exist, which means
		// this is running in the main ghooks repository
		pkg = require('../package');
	}
	return pkg;
}
