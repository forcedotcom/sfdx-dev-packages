/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { accessSync, unlinkSync, writeFileSync } = require('fs');
const SfdxDevConfig = require('./sfdx-dev-config');
const PackageJson = require('./package-json');

const fileExist = path => {
  try {
    accessSync(path);
    return true;
  } catch (err) {}
  return false;
};

module.exports = (packageRoot = require('./package-path')) => {
  const config = new SfdxDevConfig(packageRoot);
  let isLernaProject = false;

  try {
    accessSync(join(packageRoot, 'lerna.json'));
    isLernaProject = true;
  } catch (err) {}

  if (isLernaProject) {
    console.log('skipping writing files for learn project');
    return;
  }

  const added = [];
  const removed = [];
  const scriptList = config.list('scripts');

  if (scriptList.length > 0) {
    const nycPath = join(packageRoot, '.nycrc');
    if (scriptList.includes('test') && !fileExist(nycPath)) {
      const nyc = {
        nyc: {
          extends: '@salesforce/dev-config/nyc'
        }
      };
      const nycJson = JSON.stringify(nyc, null, 2);
      writeFileSync(nycPath, nycJson);
      added.push(nycPath);
    }

    if (scriptList.includes('lint')) {
      const lintConfig = config.get('lint') || {};
      const strict = lintConfig.strict;
      const tslintPath = join(packageRoot, 'tslint.json');
      const exists = fileExist(tslintPath);

      if (strict) {
        const tslint = {
          extends: '@salesforce/dev-config/tslint-strict'
        };
        const tslintJson = JSON.stringify(tslint, null, 2);
        writeFileSync(tslintPath, tslintJson);
        added.push(tslintPath);
      } else if (!strict && !exists) {
        const tslint = {
          extends: '@salesforce/dev-config/tslint'
        };
        const tslintJson = JSON.stringify(tslint, null, 2);
        writeFileSync(tslintPath, tslintJson);
        added.push(tslintPath);
      }
    }
  }
  if (added.length > 0) {
    console.log(`adding config files ${added.join(', ')}`);
  }
  if (removed.length > 0) {
    console.log(`removing config files ${removed.join(', ')}`);
  }
};
