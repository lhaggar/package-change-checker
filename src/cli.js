#!/usr/bin/env node

/* eslint-disable no-console */

const childProcess = require('child_process');

const argParser = require('./arg-parser');
const checker = require('./package-change-checker');

const { installCmd = 'npm install' } = argParser.parse(process.argv);

if (checker.hasChangedDependencies()) {
  console.log(`Dependencies have changed, running ${installCmd}...`);
  childProcess.execSync(installCmd, {
    stdio: 'inherit',
  });
} else {
  console.log('No dependency changes!');
}
