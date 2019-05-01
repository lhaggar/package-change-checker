const os = require('os');

const git = require('./git');
const loader = require('./loader');

const defaultCommit1 = 'ORIG_HEAD';
const defaultCommit2 = 'HEAD';

const hasChangedDependencies = (commitish = []) => {
  let commit1 = defaultCommit1;
  let commit2 = defaultCommit2;
  if (commitish.length >= 2) {
    if (
      git.isValidCommitish(commitish[0]) &&
      git.isValidCommitish(commitish[1])
    ) {
      [commit1, commit2] = commitish;
    }
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
