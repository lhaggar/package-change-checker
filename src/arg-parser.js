const isHash = hash => hash && hash.length > 32 && /^[a-f0-9]+$/.test(hash);

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

    if (isHash(arg)) {
      if (!acc.hashes) {
        acc.hashes = [];
      }
      acc.hashes.push(arg);
    }

    return acc;
  }, {});
};

module.exports = {
  parse,
};
