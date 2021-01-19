#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');

const packageRoot = require('../utils/package-path');
const { resolveConfig } = require('../utils/sf-config');

const nyc = require.resolve('nyc/bin/nyc');

const config = resolveConfig(packageRoot);
const testConfig = config.test || {};
const includes = testConfig.testsPath || '**/*.test.ts';

const command = `${nyc} mocha "${includes}"`;

try {
  shell.exec(command, {
    cwd: packageRoot,
    passthrough: true,
  });
} catch (err) {
  process.exitCode = 1;
}
