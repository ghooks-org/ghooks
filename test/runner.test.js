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
      'pre-push': 'make pre-push'
    }
  }}));

  it('executes the command specified on the ghooks config', function () {
    this.run(process.cwd(), '/pre-commit');
    expect(this.spawn).to
      .have.been.calledWith('make pre-commit', { stdio: 'inherit' });

    this.run(process.cwd(), '/pre-push');
    expect(this.spawn)
      .to.have.been.calledWith('make pre-push', { stdio: 'inherit' });
  });

  it('exits as the hook commands exits', function () {
    this.run(process.cwd(), '/pre-commit');
    expect(this.spawnOn).to
      .have.been.calledWith('exit', process.exit);
  });

  it('does not execute anything if the hook is not configured', function () {
    this.run(process.cwd(), '/whatever-hook');
    expect(this.spawn).to.not.have.been.called;
  });

});
