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
  if (pkg.config && pkg.config.ghooks && pkg.config.ghooks[hook]) {
    var command = pkg.config.ghooks[hook];
    
    // replace any instance of $1 or $2 etc. to that item as an process.argv
    return command.replace(/\$(\d)/g, function(match, number) {
      return process.argv[number];
    });
  }
}
