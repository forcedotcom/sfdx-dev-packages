#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');

const exists = require('../utils/exists');
const packageRoot = require('../utils/package-path');
const tsc = require.resolve('typescript/bin/tsc');

shell.exec(`${tsc} -p . --pretty`, {
  cwd: packageRoot
});

if (exists('./test')) {
  shell.exec(`${tsc} -p ./test --pretty`, {
    cwd: packageRoot
  });
}
