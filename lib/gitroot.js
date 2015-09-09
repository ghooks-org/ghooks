var execSync = require('child_process').execSync;

module.exports = function gitroot () {
	var rootPath = '';
	try {
		rootPath = execSync('git rev-parse --show-toplevel', { encoding: 'UTF-8' });
	}
	catch (e) {}

	return rootPath.split('\n')[0];
};
