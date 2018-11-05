#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

let chalk = require('chalk');
const log = require('../utils/log');
const writeDeps = require('../utils/write-dependencies');

let changed = false;
log(`Writing dependencies for the lerna project`);
changed = changed || writeDeps();

// Run it for all packages in the lerna project
changed =
  changed || require('../utils/run-in-lerna-packages')('preinstall', writeDeps);

if (changed) {
  const errorHeader = chalk.red('ERROR: ');
  const errorMsg =
    "Dependencies have changed and saved to package.json. Rerun 'yarn install' to finish the install";
  console.error(chalk.bold(`\n${errorHeader}${errorMsg}\n`));
  process.exitCode = 1;
} else {
  const standardizeFiles = require('../utils/standardize-files');
  const standardizePjson = require('../utils/standardize-pjson');

  // Standardize package.json for lerna project, but not files
  log(`Standardize package.json for the lerna project`);
  standardizePjson();

  const runAll = (packagePath, inLernaProject) => {
    standardizeFiles(packagePath, inLernaProject);
    standardizePjson(packagePath, inLernaProject);
  };

  runAll();

  // Run it for all packages in the lerna project
  require('../utils/run-in-lerna-packages')('postinstall', runAll);
}
