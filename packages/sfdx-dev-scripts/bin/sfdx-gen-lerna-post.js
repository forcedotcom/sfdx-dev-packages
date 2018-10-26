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

const { join } = require("path");
const packageRoot = require("../utils/package-root");

const postScript = join(
  packageRoot,
  "packages",
  "sfdx-dev-scripts",
  "bin",
  "sfdx-gen-scripts-post.js"
);

// Will also run this for the packageRoot when required
console.log(`Running ${postScript} for the lerna project`);
const genScriptsPost = require(postScript);

// Run it for all packages in the lerna project
require("../utils/run-in-lerna-packages")(genScriptsPost);
