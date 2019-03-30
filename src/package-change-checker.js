const os = require('os');

const git = require('./git');
const loader = require('./loader');

const defaultCommit1 = 'ORIG_HEAD';
const defaultCommit2 = 'HEAD';

const hasChangedDependencies = (hashes = []) => {
  const commit1 = hashes[0] || defaultCommit1;
  const commit2 = hashes[1] || defaultCommit2;

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
