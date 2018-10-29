/* eslint-env mocha */

const sinon = require('sinon');
const { expect } = require('chai');
const git = require('./git');

const { createLoader } = require('./loader');

describe('loader.js', () => {
  describe('createLoader', () => {
    let fileContent;

    before(() => {
      sinon.stub(git, 'getFileContent').callsFake(() => fileContent || '{}');
    });

    beforeEach(() => {
      git.getFileContent.resetHistory();
    });

    after(() => {
      git.getFileContent.restore();
    });

    it('should get the specified file at the specified commit', () => {
      createLoader('the/file/path.json')('the-commit-hash');

      expect(git.getFileContent).to.have.been.calledWithExactly(
        'the-commit-hash',
        'the/file/path.json'
      );
    });

    it('should parse and return the dependencies and devDependencies', () => {
      fileContent = JSON.stringify({
        name: 'some-package',
        version: '1.0.0',
        scripts: {
          test: 'some testing stuff',
        },
        dependencies: {
          'a-package': '1.3.1',
          'b-package': '4.2.0',
        },
        devDependencies: {
          'c-package': '3.3.7',
          'd-package': '^5.9.0',
        },
      });

      const actual = createLoader('the/file/path.json')('the-commit-hash');

      expect(actual).to.deep.equal({
        'a-package': '1.3.1',
        'b-package': '4.2.0',
        'c-package': '3.3.7',
        'd-package': '^5.9.0',
      });
    });
  });
});
