const parse = argv => {
  const [, , ...args] = argv;
  return args.reduce((acc, arg) => {
    const cmd = (arg.match(/--install-cmd=(.+)/) || [])[1];
    if (cmd) {
      acc.installCmd = cmd;
    }
    return acc;
  }, {});
};

module.exports = {
  parse,
};
