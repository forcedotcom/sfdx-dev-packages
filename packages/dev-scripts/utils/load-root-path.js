/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { accessSync } = require('fs');
const { dirname, join } = require('path');

module.exports = (fileName, cwd) => {
  let currentPath = cwd;
  if (!currentPath) {
    currentPath = process.cwd();
  }

  let projectRootPath;
  while (!projectRootPath) {
    try {
      const path = join(currentPath, fileName);
      accessSync(path);
      projectRootPath = currentPath;
    } catch (err) {
      // Pop one off
      currentPath = dirname(currentPath);
      if (currentPath === '/') {
        throw new Error(`${fileName} root not found`);
      }
    }
  }
  return projectRootPath;
};
