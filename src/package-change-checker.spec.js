/* eslint-env mocha */

const os = require('os');
const sinon = require('sinon');
const { expect } = require('chai');

const git = require('./git');
const loader = require('./loader');

const checker = require('./package-change-checker');

describe('package-change-checker.js', () => {
  describe('hasChangedDependencies', () => {
    const sandbox = sinon.createSandbox();
    let diffResult;
    let loaderStubs = {};
    let loaderStubsResults = {};

    before(() => {
      sandbox.stub(git, 'getDiff').callsFake(() => diffResult || '');
      sandbox.stub(loader, 'createLoader').callsFake(path => {
        const stub = sinon
          .stub()
          .callsFake(commit => (loaderStubsResults[path] || {})[commit]);
        loaderStubs[path] = stub;
        return stub;
      });
    });

    const teardown = () => {
      sandbox.resetHistory();
      loaderStubs = {};
      loaderStubsResults = {};
    };

    after(() => {
      sandbox.restore();
    });

    describe('with no changes', () => {
      let actual;

      before(() => {
        actual = checker.hasChangedDependencies();
      });

      after(teardown);

      it('should get the diff', () => {
        expect(git.getDiff).to.have.been.calledOnceWithExactly(
          'ORIG_HEAD',
          'HEAD',
          'package.json **/package.json'
        );
      });

      it('should not call any loaders', () => {
        expect(loader.createLoader).not.to.have.been.called();
      });

      it('should return false', () => {
        expect(actual).to.be.false();
      });
    });

    describe('with a package.json changed but no dependency changes', () => {
      let actual;

      before(() => {
        diffResult = 'package.json';
        loaderStubsResults = {
          'package.json': {
            ORIG_HEAD: { somePackage: '1.2.3' },
            HEAD: { somePackage: '1.2.3' },
          },
        };
        actual = checker.hasChangedDependencies();
      });

      after(teardown);

      it('should create one loader', () => {
        expect(loader.createLoader).to.have.been.calledOnceWithExactly(
          'package.json'
        );
      });

      it('should load the two versions of the dependencies', () => {
        expect(loaderStubs['package.json']).to.have.been.calledTwice();
        expect(loaderStubs['package.json']).to.have.been.calledWithExactly(
          'ORIG_HEAD'
        );
        expect(loaderStubs['package.json']).to.have.been.calledWithExactly(
          'HEAD'
        );
      });

      it('should return false', () => {
        expect(actual).to.be.false();
      });
    });

    describe('with a package.json dependency patch bump', () => {
      let actual;

      before(() => {
        diffResult = 'package.json';
        loaderStubsResults = {
          'package.json': {
            ORIG_HEAD: { somePackage: '1.2.3' },
            HEAD: { somePackage: '1.2.4' },
          },
        };
        actual = checker.hasChangedDependencies();
      });

      after(teardown);

      it('should return true', () => {
        expect(actual).to.be.true();
      });
    });

    describe('with a package.json dependency added', () => {
      let actual;

      before(() => {
        diffResult = 'package.json';
        loaderStubsResults = {
          'package.json': {
            ORIG_HEAD: { somePackage: '1.2.3' },
            HEAD: { somePackage: '1.2.3', addedPackage: '1.0.0' },
          },
        };
        actual = checker.hasChangedDependencies();
      });

      after(teardown);

      it('should return true', () => {
        expect(actual).to.be.true();
      });
    });

    describe('with a package.json dependency removed', () => {
      let actual;

      before(() => {
        diffResult = 'package.json';
        loaderStubsResults = {
          'package.json': {
            ORIG_HEAD: { somePackage: '1.2.3', anotherPackage: '1.0.0' },
            HEAD: { anotherPackage: '1.0.0' },
          },
        };
        actual = checker.hasChangedDependencies();
      });

      after(teardown);

      it('should return true', () => {
        expect(actual).to.be.true();
      });
    });

    describe('with multiple package.json changes, two being dependency changes', () => {
      let actual;

      before(() => {
        diffResult = [
          'package.json',
          'packages/package-1/package.json',
          'packages/package-2/package.json',
          'packages/package-3/package.json',
        ].join(os.EOL);
        loaderStubsResults = {
          'package.json': {
            ORIG_HEAD: { somePackage: '1.2.3' },
            HEAD: { somePackage: '1.2.3' },
          },
          'packages/package-1/package.json': {
            ORIG_HEAD: { somePackage: '1.2.3' },
            HEAD: { somePackage: '1.2.3', addedPackage: '1.0.0' },
          },
          'packages/package-2/package.json': {
            ORIG_HEAD: { somePackage: '1.2.3' },
            HEAD: { somePackage: '1.2.3' },
          },
          'packages/package-3/package.json': {
            ORIG_HEAD: { somePackage: '1.2.3' },
            HEAD: { somePackage: '2.0.0' },
          },
        };
        actual = checker.hasChangedDependencies();
      });

      after(teardown);

      it('should return true', () => {
        expect(actual).to.be.true();
      });
    });

    describe('with post-checkout hook providing two hashes', () => {
      before(() => {
        checker.hasChangedDependencies([
          'abcdef0123456789abcdef0123456789abcdef01',
          'abcdef0123456789abcdef0123456789abcdef02',
        ]);
      });

      after(teardown);

      it('should get the diff with the two provided hashes', () => {
        expect(git.getDiff).to.have.been.calledOnceWithExactly(
          'abcdef0123456789abcdef0123456789abcdef01',
          'abcdef0123456789abcdef0123456789abcdef02',
          'package.json **/package.json'
        );
      });
    });
  });
});
