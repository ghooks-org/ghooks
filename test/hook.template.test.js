require('./setup')()

describe('hook.template', () => {
  const template = require('../lib/hook.template')

  it('replaces the {{generated_message}} token', () => {
    expect(template.getContent()).to.match(new RegExp(template.generatedMessage))
  })

  it('replaces the {{generated_config}} token comment', () => {
    expect(template.getContent({test: 'config'})).to.match(/return\s*?\{[^}]*?["']test["'][^}:]*?:\s*?["']config["'][^}]*?}/g)
  })

})
