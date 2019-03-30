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

    describe('when quiet arg is provided', () => {
      it('should return quiet as true', () => {
        const actual = parse(['node', 'file.js', '--quiet']);

        expect(actual).to.deep.equal({
          quiet: true,
        });
      });
    });

    describe('when non-dash arg is provided', () => {
      it('should return commit-ish as array', () => {
        const actual = parse([
          'node',
          'file.js',
          'abcdef0123456789abcdef0123456789abcdef01',
          'abcdef0123456789abcdef0123456789abcdef02',
        ]);

        expect(actual).to.deep.equal({
          commitish: [
            'abcdef0123456789abcdef0123456789abcdef01',
            'abcdef0123456789abcdef0123456789abcdef02',
          ],
        });
      });
    });

    describe('when multiple args are provided', () => {
      it('should return multiple args', () => {
        const actual = parse([
          'node',
          'file.js',
          '--quiet',
          '--install-cmd=yarn install && lerna bootstrap',
          'abcdef0123456789abcdef0123456789abcdef01',
          'abcdef0123456789abcdef0123456789abcdef02',
        ]);

        expect(actual).to.deep.equal({
          quiet: true,
          installCmd: 'yarn install && lerna bootstrap',
          commitish: [
            'abcdef0123456789abcdef0123456789abcdef01',
            'abcdef0123456789abcdef0123456789abcdef02',
          ],
        });
      });
    });
  });
});
