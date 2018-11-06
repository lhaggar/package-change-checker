/* eslint-env mocha */
/* eslint-disable no-console */

const sinon = require('sinon');
const { expect } = require('chai');
const childProcess = require('child_process');

const argParser = require('./arg-parser');
const checker = require('./package-change-checker');

describe('cli.js', () => {
  const sandbox = sinon.createSandbox();
  let processEnv;

  beforeEach(() => {
    processEnv = process.env;
  });

  const setup = (hasChangedDependenciesResult, installCmd, quiet) => {
    sandbox.stub(argParser, 'parse').returns({ installCmd, quiet });
    sandbox
      .stub(checker, 'hasChangedDependencies')
      .returns(hasChangedDependenciesResult);
    sandbox.stub(childProcess, 'execSync');
    sandbox.stub(console, 'log');

    delete require.cache[require.resolve('./cli')];

    // eslint-disable-next-line global-require
    require('./cli');
  };

  afterEach(() => {
    process.env = processEnv;
    sandbox.restore();
  });

  describe('when dependencies have changed', () => {
    it('should default to run npm install', () => {
      setup(true);

      expect(
        checker.hasChangedDependencies
      ).to.have.been.calledOnceWithExactly();
      expect(console.log).to.have.been.calledOnceWithExactly(
        `Dependencies have changed, running npm install...`
      );
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
      expect(console.log).to.have.been.calledOnceWithExactly(
        `Dependencies have changed, running yarn install && lerna bootstrap...`
      );
      expect(childProcess.execSync).to.have.been.calledOnceWithExactly(
        'yarn install && lerna bootstrap',
        { stdio: 'inherit' }
      );
    });

    describe('when quiet arg is used', () => {
      it('should allow disabling of console log', () => {
        setup(true, undefined, true);

        expect(console.log).not.to.have.been.called();
      });
    });
  });

  describe('when dependencies have not changed', () => {
    it('should not run npm install', () => {
      setup(false);

      expect(
        checker.hasChangedDependencies
      ).to.have.been.calledOnceWithExactly();
      expect(console.log).to.have.been.calledOnceWithExactly(
        'No dependency changes!'
      );
      expect(childProcess.execSync).not.to.have.been.called();
    });

    describe('when quiet arg is used', () => {
      it('should allow disabling of console log', () => {
        setup(true, undefined, true);

        expect(console.log).not.to.have.been.called();
      });
    });
  });

  describe('when checking is disabled', () => {
    it('should not check dependencies or run install', () => {
      process.env.PACKAGE_CHANGE_CHECKER_DISABLED = 'true';
      setup(true);

      expect(checker.hasChangedDependencies).not.to.have.been.called();
      expect(console.log).not.to.have.been.called();
      expect(childProcess.execSync).not.to.have.been.called();
    });
  });
});
