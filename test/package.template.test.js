require('./setup')()

describe('package.template', () => {
  const generatedMessage = require('../lib/message.template').generatedMessage
  const template = require('../lib/package.template')

  it('replaces the {{generated_message}} token', () => {
    expect(template.content).to.match(new RegExp(generatedMessage))
  })

})
