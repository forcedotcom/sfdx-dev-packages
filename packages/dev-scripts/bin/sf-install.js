#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const chalk = require('chalk');
const changed = require('../utils/write-dependencies')();

if (changed) {
  const errorHeader = chalk.red('ERROR: ');
  const errorMsg = "Dependencies have changed and saved to package.json. Rerun 'yarn install' to finish the install";
  // eslint-disable-next-line no-console
  console.error(chalk.bold(`\n${errorHeader}${errorMsg}\n`));
  process.exitCode = 1;
} else {
  require('../utils/standardize-pjson')();
  require('../utils/standardize-files')();
}
