require('./setup')();

describe('hook.template.raw', function () {

  describe('when ghooks is installed', function () {

    beforeEach(function () {
      this.ghooks = stub();
      this.a = proxyquire('../lib/hook.template.raw', { '{{generated_path}}': this.ghooks });
    });

    it('delegates the hook execution to ghooks', function () {
      var dirname = process.cwd() + '/lib';
      var filename = dirname + '/hook.template.raw';
      expect(this.ghooks).to.have.been.calledWith(filename);
    });

  });

  describe('when ghooks is not found', function () {

    beforeEach(function () {
      var templatePath = require.resolve('../lib/hook.template.raw');
      delete require.cache[templatePath];

      var allButTheTemplate = {};
      allButTheTemplate[templatePath] = fileContent(templatePath);
      fsStub(allButTheTemplate);
    });

    it('warns about ghooks not being present', sinon.test(function () {
      var warn = this.stub(console, 'warn');
      require('../lib/hook.template.raw');
      expect(warn).to.have.been.calledWithMatch(/ghooks not found!/i);
    }));

  });

});
