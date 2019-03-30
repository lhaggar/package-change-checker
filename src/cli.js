#!/usr/bin/env node

/* eslint-disable no-console */

const childProcess = require('child_process');

const argParser = require('./arg-parser');
const checker = require('./package-change-checker');

const {
  installCmd = 'npm install',
  quiet = false,
  commitish = [],
} = argParser.parse(process.argv);

const log = msg => {
  if (!quiet) {
    console.log(msg);
  }
};

if (process.env.PACKAGE_CHANGE_CHECKER_DISABLED !== 'true') {
  if (checker.hasChangedDependencies(commitish)) {
    log(`Dependencies have changed, running ${installCmd}...`);
    childProcess.execSync(installCmd, {
      stdio: 'inherit',
    });
  } else {
    log('No dependency changes!');
  }
}
