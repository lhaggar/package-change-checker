/* eslint-env mocha */

const { expect } = require('chai');

const { parse } = require('./arg-parser');

describe('arg-parse.js', () => {
  describe('parse', () => {
    describe('when no argument is provided', () => {
      it('should return an empty object', () => {
        const actual = parse(['node', 'file.js']);

        expect(actual).to.deep.equal({});
      });
    });

    describe('when a custom install cmd is provided', () => {
      it('should return the install-cmd argument', () => {
        const actual = parse([
          'node',
          'file.js',
          '--install-cmd=yarn install && lerna bootstrap',
        ]);

        expect(actual).to.deep.equal({
          installCmd: 'yarn install && lerna bootstrap',
        });
      });
    });
  });
});
