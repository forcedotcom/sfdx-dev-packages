/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
