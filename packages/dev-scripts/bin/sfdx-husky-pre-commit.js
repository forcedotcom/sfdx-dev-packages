#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');

const packageRoot = require('../utils/package-path');
const prettierConfig = require.resolve('@salesforce/dev-config/prettier');

// double -- to pass through yarn then lerna
shell.exec(`yarn lint`, {
  cwd: packageRoot,
});

shell.exec(`pretty-quick --staged --config ${prettierConfig}`, {
  cwd: packageRoot,
});
