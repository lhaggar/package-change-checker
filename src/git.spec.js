/* eslint-env mocha */

const sinon = require('sinon');
const { expect } = require('chai');
const childProcess = require('child_process');

const { getDiff, getFileContent } = require('./git');

describe('git.js', () => {
  let execResult;

  before(() => {
    sinon.stub(childProcess, 'execSync').callsFake(() => execResult());
  });

  beforeEach(() => {
    childProcess.execSync.resetHistory();
  });

  after(() => {
    childProcess.execSync.restore();
  });

  describe('getDiff', () => {
    it('should take args', () => {
      execResult = () => Buffer.from('');

      getDiff('hash-1', 'hash-2', 'somefile.js **/somefile2.js');

      expect(childProcess.execSync).to.have.been.calledWithExactly(
        'git diff-tree -r --name-only --no-commit-id hash-1 hash-2 somefile.js **/somefile2.js'
      );
    });

    it('should return the trimmed string result', () => {
      execResult = () => Buffer.from('some content\r\nnew line\r\n  ');

      const actual = getDiff();

      expect(actual).to.equal('some content\r\nnew line');
    });
  });

  describe('getFileContent', () => {
    it('should run git show', () => {
      execResult = () => Buffer.from('');

      getFileContent('the-commit-hash', 'file/path.js');

      expect(childProcess.execSync).to.have.been.calledWithExactly(
        'git show the-commit-hash:file/path.js'
      );
    });

    it('should return the trimmed string result', () => {
      execResult = () => Buffer.from('some content\r\nnew line\r\n  ');

      const actual = getFileContent('the-commit-hash', 'file/path.js');

      expect(actual).to.equal('some content\r\nnew line');
    });

    it('should return an empty object string on error', () => {
      execResult = () => {
        throw new Error(
          `fatal: Path 'package.json' exists on disk, but not in 'ORIG_HEAD'.`
        );
      };

      const actual = getFileContent('the-commit-hash', 'file/path.js');

      expect(actual).to.equal('{}');
    });
  });
});
