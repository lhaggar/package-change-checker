const childProcess = require('child_process');

const run = cmd =>
  childProcess
    .execSync(cmd)
    .toString()
    .trim();

const isValidCommitish = commitish => {
  try {
    const type = run(`git cat-file -t ${commitish}`);
    return type === 'commit' || type === 'tag';
  } catch (e) {
    return false;
  }
};

const getDiff = (commit1, commit2, filter) =>
  run(
    `git diff-tree -r --name-only --no-commit-id ${commit1} ${commit2} ${filter}`
  );

const getFileContent = (commit, path) => {
  try {
    return run(`git show ${commit}:${path}`);
  } catch (e) {
    return '{}';
  }
};

module.exports = {
  getDiff,
  getFileContent,
  isValidCommitish,
};
