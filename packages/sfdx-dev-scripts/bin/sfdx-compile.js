#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { accessSync } = require('fs');
const shell = require('shelljs');

shell.set('-e');
shell.set('+v');

const packageRoot = require('../utils/package-root');
const tsc = join(__dirname, '..', 'node_modules', '.bin', 'tsc');

// Not a lerna project, so clean files
console.log('compiling using tsconfig');
shell.exec(`${tsc} -p .`, {
    cwd: packageRoot
});
try {
    accessSync(join(packageRoot, 'test'));
    console.log('compiling using test/tsconfig');
    shell.exec(`${tsc} -p test --noEmit`, {
        cwd: packageRoot
    });
} catch (err) {}
