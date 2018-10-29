/* eslint-env mocha */

const sinon = require('sinon');
const { expect } = require('chai');
const childProcess = require('child_process');

const argParser = require('./arg-parser');
const checker = require('./package-change-checker');

describe('cli.js', () => {
  const sandbox = sinon.createSandbox();

  const setup = (hasChangedDependenciesResult, installCmd) => {
    sandbox.stub(argParser, 'parse').returns({ installCmd });
    sandbox
      .stub(checker, 'hasChangedDependencies')
      .returns(hasChangedDependenciesResult);
    sandbox.stub(childProcess, 'execSync');

    delete require.cache[require.resolve('./cli')];

    // eslint-disable-next-line global-require
    require('./cli');
  };

  afterEach(() => {
    sandbox.restore();
  });

  describe('when dependencies have changed', () => {
    it('should default to run npm install', () => {
      setup(true);

      expect(
        checker.hasChangedDependencies
      ).to.have.been.calledOnceWithExactly();
      expect(childProcess.execSync).to.have.been.calledOnceWithExactly(
        'npm install',
        { stdio: 'inherit' }
      );
    });

    it('should allow overriding of install cmd', () => {
      setup(true, 'yarn install && lerna bootstrap');

      expect(
        checker.hasChangedDependencies
      ).to.have.been.calledOnceWithExactly();
      expect(childProcess.execSync).to.have.been.calledOnceWithExactly(
        'yarn install && lerna bootstrap',
        { stdio: 'inherit' }
      );
    });
  });

  describe('when dependencies have not changed', () => {
    it('should not run npm install', () => {
      setup(false);

      expect(
        checker.hasChangedDependencies
      ).to.have.been.calledOnceWithExactly();
      expect(childProcess.execSync).not.to.have.been.called();
    });
  });
});
