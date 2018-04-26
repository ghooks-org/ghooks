const path = require('path')
require('./setup')()

describe('hook.template.raw', function describeHookTemplateRaw() {

  describe('when ghooks is installed', () => {

    beforeEach(() => {
      this.ghooks = sinon.stub()
      const stub = {
        ghooks: this.ghooks,
        fs: {
          statSync: () => {
            return {isFile: () => true}
          },
        },
      }
      proxyquire('../lib/hook.template.raw', stub)
    })

    it('delegates the hook execution to ghooks', () => {
      const filename = path.resolve(process.cwd(), 'lib', 'hook.template.raw')
      const calledWith = path.resolve(__dirname, '../', '../', 'node_modules')
      expect(this.ghooks).to.have.been.calledWith(calledWith, filename)
    })

    it('works when node modules cannot be found', () => {
      const ghooks = sinon.stub()
      this.throwException = true
      proxyquire('../lib/hook.template.raw', {
        ghooks,
        fs: {
          statSync: () => {
            if (this.throwException) {
              this.throwException = false
              throw new Error('path missing')
            }
          }
        },
        path: {
          resolve: () => {
            if (!this.throwException) {
              return '{{node_modules_path}}'
            }

            return ''
          },
        },
      })

      const filename = path.resolve(process.cwd(), 'lib', 'hook.template.raw')
      expect(ghooks).to.have.been.calledWith('{{node_modules_path}}', filename)
    })

  })

  describe('when ghooks is not found', () => {
    it('warns about ghooks not being present', sinon.test(function test() {
      const warn = this.stub(console, 'warn')
      proxyquire('../lib/hook.template.raw', {ghooks: null})
      expect(warn).to.have.been.calledWithMatch(/ghooks not found!/i)
    }))

  })

  describe('when ghooks is installed, but the node working dir is below the project dir', () => {

    beforeEach(() => {
      const ghooksEntryPoint = path.resolve(__dirname, '../', '../', 'node_modules', 'ghooks')

      this.ghooks = sinon.stub()
      const stub = {
        ghooks: null,
        [ghooksEntryPoint]: this.ghooks,
        fs: {
          statSync: () => {
            return {isFile: () => true}
          },
        },
      }
      proxyquire('../lib/hook.template.raw', stub)
    })

    it('delegates the hook execution to ghooks', () => {
      const filename = path.resolve(process.cwd(), 'lib', 'hook.template.raw')
      const calledWith = path.resolve(__dirname, '../', '../', 'node_modules')
      expect(this.ghooks).to.have.been.calledWith(calledWith, filename)
    })

  })

  describe('when ghooks is installed, using worktree / in a submodule', () => {

    beforeEach(() => {
      const worktree = '../../a/path/somewhere/else'
      const ghooksResolved = path.resolve(process.cwd(), worktree, 'node_modules', 'ghooks')
      const stub = {
        ghooks: null,
        fs: {
          statSync: () => {
            return {isFile: () => true}
          },
          readFileSync: () => `[core]\n\tworktree = ${worktree}`,
        },
      }
      stub[ghooksResolved] = this.ghooks = sinon.stub()
      proxyquire('../lib/hook.template.raw', stub)
    })

    it('delegates the hook execution to ghooks', () => {
      const filename = path.resolve(process.cwd(), 'lib', 'hook.template.raw')
      const calledWith = path.resolve(__dirname, '../', '../', 'node_modules')
      expect(this.ghooks).to.have.been.calledWith(calledWith, filename)
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
