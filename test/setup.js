const chai = require('chai')
chai.use(require('sinon-chai'))
chai.use(require('chai-string'))

global.expect = chai.expect
global.sinon = require('sinon')
global.fsStub = require('mock-fs')
global.proxyquire = require('proxyquire').noCallThru()

module.exports = function restore() {
  afterEach(fsStub.restore)
}
