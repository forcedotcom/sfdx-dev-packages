#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');

const packageRoot = require('../utils/package-path');

console.log(packageRoot);
shell.exec(`${__dirname}/sfdx-clean`, {
  cwd: packageRoot
});
shell.exec(`${__dirname}/sfdx-compile`, {
  cwd: packageRoot
});
shell.exec(`${__dirname}/sfdx-lint`, {
  cwd: packageRoot
});
shell.exec(`${__dirname}/sfdx-test`, {
  cwd: packageRoot
});
