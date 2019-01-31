/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { accessSync } = require('fs');

exports.isMultiPackageProject = function(packageRoot) {
  let isMulti = false;
  try {
    accessSync(join(packageRoot, 'lerna.json'));
    isMulti = true;
  } catch (err) {}
  return isMulti;
};
