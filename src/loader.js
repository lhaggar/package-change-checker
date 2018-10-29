const git = require('./git');

const createLoader = path => commit => {
  const content = git.getFileContent(commit, path);
  const json = JSON.parse(content);
  return {
    ...json.dependencies,
    ...json.devDependencies,
  };
};

module.exports = {
  createLoader,
};
