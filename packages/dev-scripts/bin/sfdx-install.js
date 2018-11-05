#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

let chalk = require('chalk');
const changed = require('../utils/write-dependencies')();

if (changed) {
  const errorHeader = chalk.red('ERROR: ');
  const errorMsg =
    "Dependencies have changed and saved to package.json. Rerun 'yarn install' to finish the install";
  console.error(chalk.bold(`\n${errorHeader}${errorMsg}\n`));
  process.exitCode = 1;
} else {
  require('../utils/standardize-pjson')();
  require('../utils/standardize-files')();
}
