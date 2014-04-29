require('./setup')();

describe('install', function () {
  var install = require('../lib/install');
  var hookContent = fileContent(require('path')
    .resolve(__dirname, '../lib/hook.template'));

  it('warns when the target is not a git project', function () {
    fsStub({});
    console.warn = function (message) {
      expect(message).to.match(/this does not seem to be a git project/i);
    };
    install();
  });

  it('creates hook files', function () {
    fsStub({ '.git/hooks': {} });
    install();

    var hooks = fs.readdirSync('.git/hooks');

    expect(hooks).to.include('post-update');
    expect(fileContent('.git/hooks/post-update')).to.equal(hookContent);
    expect(fileMode('.git/hooks/post-update')).to.equal('755');

    expect(hooks).to.include('pre-applypatch');
    expect(fileContent('.git/hooks/pre-applypatch')).to.equal(hookContent);
    expect(fileMode('.git/hooks/pre-applypatch')).to.equal('755');

    expect(hooks).to.include('pre-commit');
    expect(fileContent('.git/hooks/pre-commit')).to.equal(hookContent);
    expect(fileMode('.git/hooks/pre-commit')).to.equal('755');

    expect(hooks).to.include('pre-push');
    expect(fileContent('.git/hooks/pre-push')).to.equal(hookContent);
    expect(fileMode('.git/hooks/pre-push')).to.equal('755');

    expect(hooks).to.include('pre-rebase');
    expect(fileContent('.git/hooks/pre-rebase')).to.equal(hookContent);
    expect(fileMode('.git/hooks/pre-rebase')).to.equal('755');

    expect(hooks).to.include('update');
    expect(fileContent('.git/hooks/update')).to.equal(hookContent);
    expect(fileMode('.git/hooks/update')).to.equal('755');
  });

  it('backs up existing hooks', function () {
    var existingContent = '# existing content';
    fsStub({ '.git/hooks': {
      'pre-commit': existingContent,
      'pre-push': existingContent
    }});
    install();

    var files = fs.readdirSync('.git/hooks');

    expect(files).to.include('pre-commit.bkp');
    expect(fileContent('.git/hooks/pre-commit.bkp')).to.equal(existingContent);
    expect(files).to.include('pre-commit');

    expect(files).to.include('pre-push.bkp');
    expect(fileContent('.git/hooks/pre-push.bkp')).to.equal(existingContent);
    expect(files).to.include('pre-push');
  });
});
