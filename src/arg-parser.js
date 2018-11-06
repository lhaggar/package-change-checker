const parse = argv => {
  const [, , ...args] = argv;
  return args.reduce((acc, arg) => {
    const installCmd = (arg.match(/--install-cmd=(.+)/) || [])[1];
    if (installCmd) {
      acc.installCmd = installCmd;
    }

    const quiet = arg.match(/--quiet/);
    if (quiet) {
      acc.quiet = true;
    }

    return acc;
  }, {});
};

module.exports = {
  parse,
};
