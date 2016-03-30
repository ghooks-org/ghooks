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
    it('warns about ghooks not being present', sinon.test(function test() {
      const warn = this.stub(console, 'warn')
      const exitMessage = 'Exit process when ghooks not being present'
      // instead of really exiting the process ...
      const exit = this.stub(process, 'exit', () => {
        // ... throw a predetermined exception, thus preventing
        // further code execution within the tested module ...
        throw Error(exitMessage)
      })
      // ... and expect it to be eventually thrown
      expect(() => {
        proxyquire('../lib/hook.template.raw', {ghooks: null})
      }).to.throw(exitMessage)
      expect(warn).to.have.been.calledWithMatch(/ghooks not found!/i)
      expect(exit).to.have.been.calledWith(1)
    }))

  })

})
