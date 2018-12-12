#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');

const packageRoot = require('../utils/package-path');
const prettierConfig = require.resolve('@salesforce/dev-config/prettier');

// double -- to pass through yarn then lerna
shell.exec(`yarn lint-fix`, {
  cwd: packageRoot
});

shell.exec(`pretty-quick --staged --config ${prettierConfig}`, {
  cwd: packageRoot
});
