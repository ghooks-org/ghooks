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
      proxyquire('../lib/hook.template.raw', {ghooks: null})
      expect(warn).to.have.been.calledWithMatch(/ghooks not found!/i)
    }))

  })

  describe('when ghooks is not found and exitWithError is set to true', () => {
    beforeEach(() => {
      global.__testonly_ghooksConfig__ = {exitWithError: true} // eslint-disable-line camelcase
    })

    afterEach(() => {
      global.__testonly_ghooksConfig__ = null // eslint-disable-line camelcase
    })

    it('warns about ghooks not being present and exits with error', sinon.test(function test() {
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

  describe('when ghooks is installed, using worktree / in a submodule', () => {

    beforeEach(() => {
      const path = require('path')
      const worktree = '../../a/path/somewhere/else'
      const ghooksResolved = path.resolve(process.cwd(), worktree, 'node_modules', 'ghooks')
      const stub = {
        fs: {
          statSync: () => {
            return {isFile: () => true}
          },
          readFileSync: () => '[core]\n\tworktree = ' + worktree,
        },
      }
      stub[ghooksResolved] = this.ghooks = sinon.stub()
      proxyquire('../lib/hook.template.raw', stub)
    })

    it('delegates the hook execution to ghooks', () => {
      const dirname = process.cwd() + '/lib'
      const filename = dirname + '/hook.template.raw'
      expect(this.ghooks).to.have.been.calledWith(dirname, filename)
    })

  })

  describe('when ghooks is not found, using worktree / in a submodule', () => {

    it('warns about ghooks not being found in gitdir', sinon.test(function test() {
      const stub = {
        ghooks: null,
        fs: {
          statSync: () => {
            return {isFile: () => true}
          },
          readFileSync: () => '[core]\n\tworktree = ../../a/path/somewhere/else',
        },
      }
      const warn = this.stub(console, 'warn')
      proxyquire('../lib/hook.template.raw', stub)
      expect(warn).to.have.been.calledWithMatch(/ghooks not found!/i)
    }))

    it('warns about ghooks not being found due to no gitdir being present', sinon.test(function test() {
      const stub = {
        ghooks: null,
        fs: {
          statSync: () => {
            return {isFile: () => true}
          },
          readFileSync: () => '[anything]\n\tsomething = else',
        },
      }
      const warn = this.stub(console, 'warn')
      proxyquire('../lib/hook.template.raw', stub)
      expect(warn).to.have.been.calledWithMatch(/ghooks not found!/i)
    }))

    it('warns about ghooks not being found due to no valid git config being present', sinon.test(function test() {
      const stub = {
        ghooks: null,
        fs: {
          statSync: () => {
            return {isFile: () => false}
          },
        },
      }
      const warn = this.stub(console, 'warn')
      proxyquire('../lib/hook.template.raw', stub)
      expect(warn).to.have.been.calledWithMatch(/ghooks not found!/i)
    }))

  })

})
