#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('shelljs');

shell.set('-e');
shell.set('+v');

const packageRoot = require('../utils/package-root');
const prettierConfig = require.resolve('@salesforce/dev-config/.prettierrc');

shell.exec(`pretty-quick --staged --config ${prettierConfig}`, {
  cwd: packageRoot
});

// TODO targets not added yet
// shell.exec("yarn docs", {
//   cwd: packageRoot
// });

// shell.exec("git add **/docs", {
//   cwd: packageRoot
// });
