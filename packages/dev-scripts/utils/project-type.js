/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { accessSync } = require('fs');

exports.isMultiPackageProject = function (packageRoot) {
  let isMulti = false;
  try {
    accessSync(join(packageRoot, 'lerna.json'));
    isMulti = true;
  } catch (err) {
    /* do nothing */
  }
  return isMulti;
};
