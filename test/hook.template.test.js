require('./setup')();

describe('hook.template', function () {
  var template = require('../lib/hook.template');

  it('replaces the {{generated_message}} token', function () {
    expect(template.content).to.match(new RegExp(template.generatedMessage));
  });

});
