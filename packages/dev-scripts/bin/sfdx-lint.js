#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');

const exists = require('../utils/exists');
const packageRoot = require('../utils/package-path');

const lint = require.resolve('eslint/bin/eslint');

const extras = process.argv.slice(2).join(' ');
// eslint-disable-next-line no-console
console.log(`${lint} ${extras} ./src/**/*.ts`);
shell.exec(`${lint} ${extras} ./src/**/*.ts`, {
  cwd: packageRoot,
});

if (exists('./test')) {
  shell.exec(`${lint} ${extras} ./test/**/*.ts`, {
    cwd: packageRoot,
  });
}
