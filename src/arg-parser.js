const parse = argv => {
  const [, , ...args] = argv;
  return args.reduce((acc, arg) => {
    if (/^-/.test(arg)) {
      const installCmd = (arg.match(/--install-cmd=(.+)/) || [])[1];
      if (installCmd) {
        acc.installCmd = installCmd;
      }

      const quiet = arg.match(/--quiet/);
      if (quiet) {
        acc.quiet = true;
      }
    } else {
      // If arg does not start with hyphen, assume commitish
      if (!acc.commitish) {
        acc.commitish = [];
      }
      acc.commitish.push(arg);
    }

    return acc;
  }, {});
};

module.exports = {
  parse,
};
