#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');
const { isPlugin } = require('../utils/project-type');
const packageRoot = require('../utils/package-path');

shell.exec('yarn build');

if (isPlugin(packageRoot)) {
  shell.exec('oclif-dev manifest');
}
