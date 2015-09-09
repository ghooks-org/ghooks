var chai = require('chai');
chai.use(require('sinon-chai'));

global.expect  = chai.expect;
global.sinon = require('sinon');
global.stub  = sinon.stub;
global.spy  = sinon.spy;
global.fsStub = require('mock-fs');
global.fs = require('fs');
global.proxyquire = require('proxyquire').noCallThru();

global.fileContent = function (file) {
  return fs.readFileSync(file, 'UTF-8');
};

global.fileMode = function (file) {
  return (fs.statSync(file).mode & 07777).toString(8);
};

module.exports = function () {
  afterEach(fsStub.restore);
};
