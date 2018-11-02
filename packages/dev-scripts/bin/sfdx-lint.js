#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');

const packageRoot = require('../utils/package-path');
const Config = require('../utils/sfdx-dev-config');
const config = new Config(packageRoot);
const lintConfig = config.get('lint') || {};

const lint = require.resolve('tslint/bin/tslint');

// If not strict, use the local tslint file
const configPath = lintConfig['strict']
  ? require.resolve('@salesforce/dev-config/tslint-strict')
  : 'tslint.json';

shell.exec(`${lint} -p . -c ${configPath} -t stylish`, {
  cwd: packageRoot
});
