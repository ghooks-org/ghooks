require('./setup')()

describe('config', function describeConfig() {
  it('returns default configuration', () => {
    const expectedConfig = {
      exitWithError: false,
      hooks: {},
    }

    const stub = setupStubWithPackageJson({config: {}})

    const {getConfig} = proxyquire('../lib/config', stub)

    expect(getConfig()).to.deep.equal(expectedConfig)
  })

  it('reads custom configuration and hooks', () => {
    const expectedConfig = {
      exitWithError: true,
      hooks: {'pre-commit': 'make pre-commit'},
    }

    const stub = setupStubWithPackageJson({
      config: {
        ghooks: expectedConfig,
      },
    })

    const {getConfig} = proxyquire('../lib/config', stub)

    expect(getConfig()).to.deep.equal(expectedConfig)
  })

  it('reads custom configuration and hooks (deprecated way)', () => {
    const expectedConfig = {
      exitWithError: true,
      hooks: {'pre-push': 'make pre-push'},
    }

    const stub = setupStubWithPackageJson({
      config: {
        ghooks: expectedConfig.hooks,
        'ghooks-exitWithError': expectedConfig.exitWithError,
      },
    })

    const {getConfig} = proxyquire('../lib/config', stub)

    expect(getConfig()).to.deep.equal(expectedConfig)
  })

  it('reads custom configuration and hooks (overriding the deprecated way)', () => {
    const expectedConfig = {
      exitWithError: false,
      hooks: {'commit-msg': 'make commit-msg $1; echo "CHANGED!"'},
    }

    const stub = setupStubWithPackageJson({
      config: {
        ghooks: {
          exitWithError: false,
          hooks: {'commit-msg': 'make commit-msg $1; echo "CHANGED!"'},
          'commit-msg': 'make commit-msg $1',
        },
        'ghooks-exitWithError': true,
      },
    })

    const {getConfig} = proxyquire('../lib/config', stub)

    expect(getConfig()).to.deep.equal(expectedConfig)
  })
})

function setupStubWithPackageJson(content) {
  return {
    findup: {sync: () => null},
    path: {resolve: () => null},
    fs: {readFileSync: () => JSON.stringify(content)},
  }
}
