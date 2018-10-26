#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require("shelljs");

shell.set("-e");
shell.set("+v");

const packageRoot = require("../utils/package-root");

// TODO scripts not added yet
// shell.exec("yarn clean", {
//   cwd: packageRoot
// });
// shell.exec("yarn test", {
//   cwd: packageRoot
// });
