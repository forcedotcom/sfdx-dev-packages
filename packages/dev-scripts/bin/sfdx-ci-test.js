#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');
const packageRoot = require('../utils/package-path');

// double `--` to first through pass yarn and then through lerna :(
shell.exec('yarn compile -- -- --emitTests', {
  cwd: packageRoot
});

shell.exec(`nyc mocha 'packages/**/*.test.js'`, {
  cwd: packageRoot
});
