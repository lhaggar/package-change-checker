const os = require('os');

const git = require('./git');
const loader = require('./loader');

const commit1 = 'ORIG_HEAD';
const commit2 = 'HEAD';

const hasChangedDependencies = () =>
  git
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

module.exports = {
  hasChangedDependencies,
};
