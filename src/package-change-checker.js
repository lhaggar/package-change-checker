const os = require('os');

const git = require('./git');
const loader = require('./loader');

let commit1 = 'ORIG_HEAD';
let commit2 = 'HEAD';

const hasChangedDependencies = (hashes = []) => {
  if (hashes.length === 2) {
    // assume post-checkout scenario with two hashes given as params from Git
    [commit1, commit2] = hashes;
  }
  return git
    .getDiff(commit1, commit2, 'package.json **/package.json')
    .split(os.EOL)
    .filter(Boolean)
    .map(path => loader.createLoader(path))
    .map(fileContentLoader => ({
      before: fileContentLoader(commit1),
      after: fileContentLoader(commit2),
    }))
    .some(
      packages =>
        JSON.stringify(packages.before) !== JSON.stringify(packages.after)
    );
};

module.exports = {
  hasChangedDependencies,
};
