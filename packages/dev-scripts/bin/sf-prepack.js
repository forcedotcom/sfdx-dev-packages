#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const chalk = require('chalk');
const shell = require('../utils/shelljs');
const { isPlugin } = require('../utils/project-type');
const packageRoot = require('../utils/package-path');

shell.exec('yarn build');

if (isPlugin(packageRoot)) {
  if (shell.which('oclif')) {
    shell.exec('oclif manifest .');
  } else if (shell.which('oclif-dev')) {
    shell.exec('oclif-dev manifest');
  } else {
    // eslint-disable-next-line no-console
    console.log(chalk.red('Failed:'), 'Cannot generate oclif.manifest.json because oclif is not installed.');
    process.exitCode = 1;
  }
}
