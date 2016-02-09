require('./setup')()

describe('hook.template.raw', function describeHookTemplateRaw() {

  describe('when ghooks is installed', () => {

    beforeEach(() => {
      this.ghooks = sinon.stub()
      proxyquire('../lib/hook.template.raw', {ghooks: this.ghooks})
    })

    it('delegates the hook execution to ghooks', () => {
      const dirname = process.cwd() + '/lib'
      const filename = dirname + '/hook.template.raw'
      expect(this.ghooks).to.have.been.calledWith(dirname, filename)
    })

  })

  describe('when ghooks is not found', () => {
    const fs = require('fs')

    beforeEach(() => {
      const templatePath = require.resolve('../lib/hook.template.raw')
      delete require.cache[templatePath]
      delete require.cache[require.resolve('ghooks')]

      const allButTheTemplate = {}
      allButTheTemplate[templatePath] = fs.readFileSync(templatePath, 'UTF-8')
      fsStub(allButTheTemplate)
    })

    it('warns about ghooks not being present', sinon.test(function test() {
      const warn = this.stub(console, 'warn')
      require('../lib/hook.template.raw')
      expect(warn).to.have.been.calledWithMatch(/ghooks not found!/i)
    }))

  })

})
