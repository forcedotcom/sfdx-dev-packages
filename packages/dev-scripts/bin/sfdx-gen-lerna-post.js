#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const standardizeFiles = require('../utils/standardize-files');
const standardizePjson = require('../utils/standardize-pjson');

// Standardize package.json for lerna project, but not files
console.log(`Standardize package.json for the lerna project`);
standardizePjson();

const runAll = (packagePath, inLernaProject) => {
  standardizeFiles(packagePath, inLernaProject);
  standardizePjson(packagePath, inLernaProject);
};

runAll();

// Run it for all packages in the lerna project
require('../utils/run-in-lerna-packages')(runAll);
