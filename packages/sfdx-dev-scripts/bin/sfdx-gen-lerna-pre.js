#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const writeDeps = require('../utils/write-dependencies');

console.log(`Writing dependencies for the lerna project`);
writeDeps();

// Run it for all packages in the lerna project
require('../utils/run-in-lerna-packages')(writeDeps);
