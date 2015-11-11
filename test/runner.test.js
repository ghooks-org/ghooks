var path = require('path');
var getPathVar = require('manage-path/dist/get-path-var');
require('./setup')();

describe('runner', function () {
  beforeEach(function () {
    var on = this.spawnOn = stub();
    this.spawn = spy(function () { return { on: on }; });
    this.run = proxyquire('../lib/runner', { 'spawn-command': this.spawn });
  });

  beforeEach(setupPackageJsonWith({ config: {
    ghooks: {
      'pre-commit': 'make pre-commit',
      'pre-push': 'make pre-push',
      'commit-msg': 'make commit-msg $1',
      'post-merge': 'echo $PATH'
    }
  }}));

  it('executes the command specified on the ghooks config', function () {
    this.run(process.cwd(), '/pre-commit');
    expect(this.spawn).to
      .have.been.calledWithMatch('make pre-commit', { stdio: 'inherit' });

    this.run(process.cwd(), '/pre-push');
    expect(this.spawn)
      .to.have.been.calledWithMatch('make pre-push', { stdio: 'inherit' });
  });

  it('exits as the hook commands exits', function () {
    this.run(process.cwd(), '/pre-commit');
    expect(this.spawnOn).to
      .have.been.calledWith('exit');
  });

  it('does not execute anything if the hook is not configured', function () {
    this.run(process.cwd(), '/whatever-hook');
    expect(this.spawn).to.not.have.been.called;
  });

  it('converts argument indicators to arguments from the githook', function () {
    var oldProcessArgv = process.argv;
    process.argv = [path.join(process.cwd(), '.git/hooks/commit-msg'), './.git/COMMIT_EDITMSG'];
    this.run(process.cwd(), '/commit-msg');
    expect(this.spawn)
      .to.have.been.calledWithMatch('make commit-msg ./.git/COMMIT_EDITMSG', { stdio: 'inherit' });
    process.argv = oldProcessArgv;
  });

  it('should alter the path', function () {
    this.run(process.cwd(), '/pre-push');
    var prefixPath = path.resolve(process.cwd(), 'node_modules', '.bin');
    var calledOptions = this.spawn.firstCall.args[1];
    expect(calledOptions.env[getPathVar()])
      .to.startWith(prefixPath);
  });
});
