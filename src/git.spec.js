/* eslint-env mocha */

const sinon = require('sinon');
const { expect } = require('chai');
const childProcess = require('child_process');

const { getDiff, getFileContent, isValidCommitish } = require('./git');

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

  describe('isValidCommitish', () => {
    it('should return true for commits', () => {
      execResult = () => Buffer.from('commit');

      const actual = isValidCommitish('the-commit-hash');

      expect(actual).to.be.true();
    });

    it('should return true for tags', () => {
      execResult = () => Buffer.from('tag');

      const actual = isValidCommitish('the-commit-hash');

      expect(actual).to.be.true();
    });

    it('should return false for types other than commits and tags', () => {
      execResult = () => Buffer.from('blob');

      const actual = isValidCommitish('the-commit-hash');

      expect(actual).to.be.false();
    });

    it('should return false for invalid references', () => {
      execResult = () => Buffer.from('rebase');

      const actual = isValidCommitish('the-commit-hash');

      expect(actual).to.be.false();
    });

    it('should return false for errors', () => {
      execResult = () => {
        throw new Error(`fatal: Not a valid object name the-commit-hash`);
      };

      const actual = isValidCommitish('the-commit-hash');

      expect(actual).to.be.false();
    });
  });
});
