#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * 
 */

const { join } = require('path');
const packageRoot = require('../utils/package-root');
const shell = require('shelljs');

shell.set('-e');
shell.set('+v');

const preScript = join(packageRoot, 'packages', 'sfdx-dev-scripts', 'bin', 'sfdx-gen-scripts-pre.js');

console.log(`Running ${preScript} for the lerna project`);
shell.exec(preScript, {
    cwd: join(packageRoot)
});

require('../utils/run-in-lerna-packages')(preScript);