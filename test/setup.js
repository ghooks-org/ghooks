var chai = require('chai');
chai.use(require('sinon-chai'));

global.expect  = chai.expect;
global.stub  = require('sinon').stub;
global.spy  = require('sinon').spy;
global.fsStub = require('mock-fs');
global.fs = require('fs');
global.proxyquire = require('proxyquire');

global.fileContent = function (file) {
  return fs.readFileSync(file, 'UTF-8');
};

global.fileMode = function (file) {
  return (fs.statSync(file).mode & 07777).toString(8);
};

global.setupPackageJsonWith = function (content) { return function () {
  fsStub({ 'package.json': JSON.stringify(content) });
};};

module.exports = function () {
  afterEach(fsStub.restore);
};
