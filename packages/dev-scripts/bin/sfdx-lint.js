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

const lint = require.resolve('tslint/bin/tslint');

const extras = process.argv.slice(2).join(' ');

shell.exec(`${lint} -p . -t stylish ${extras}`, {
  cwd: packageRoot
});

if (exists('./test')) {
  shell.exec(`${lint} -p ./test -t stylish ${extras}`, {
    cwd: packageRoot
  });
}
