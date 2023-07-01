require('./setup')()

describe('hook.template', () => {
  const template = require('../lib/hook.template')

  it('replaces the {{generated_message}} token', () => {
    expect(template.content).to.match(new RegExp(template.generatedMessage))
  })

  it('replaces the {{node_bin}} token with a default value', () => {
    expect(template.content).to.match(new RegExp(template.nodeBin))
  })

  it('replaces the {{node_bin}} token with a config value', () => {
    const nodeBin = 'my/custom/node/bin/path'
    const nodeBinTemplate = proxyquire('../lib/hook.template', {
      findup: {
        sync: () => './'
      },
      fs: {
        readFileSync: () => JSON.stringify({config: {ghooks: {node: nodeBin}}})
      }
    })
    expect(nodeBinTemplate.content).to.match(new RegExp(nodeBin))
  })
})
