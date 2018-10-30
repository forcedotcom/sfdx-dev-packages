/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { accessSync } = require('fs');
const { join } = require('path');
const SfdxDevConfig = require('./sfdx-dev-config');
const PackageJson = require('./package-json');

module.exports = (packageRoot = require('./package-path'), inLernaProject) => {
  const config = new SfdxDevConfig(packageRoot);
  const pjson = new PackageJson(packageRoot);
  let isLernaProject = false;

  try {
    accessSync(join(packageRoot, 'lerna.json'));
    isLernaProject = true;
  } catch (err) {}

  console.log(`adding scripts to ${pjson.pjsonPath}`);

  // GENERATE SCRIPTS
  const scriptList = config.list('scripts');

  if (scriptList.length > 0) {
    console.log(`Updating scripts: ${scriptList.join(', ')}`);

    const scripts = pjson.get('scripts');
    for (const script of scriptList) {
      if (isLernaProject) {
        scripts[script] = `lerna run ${script}`;
      } else {
        let scriptArgs = script.split('-');
        if (scriptArgs.length > 1) {
          const scriptName = scriptArgs[0];
          scriptArgs = scriptArgs.splice(1).join(' ');
          scripts[script] = `yarn sfdx-${scriptName} ${scriptArgs}`;
        } else {
          scripts[script] = `yarn sfdx-${script}`;
        }
      }
    }
  }

  // Husky should only be at the root git project (the lerna project)
  if (inLernaProject) {
    delete pjson.contents.husky;
  } else {
    // GENERATE HUSKY
    const huskyList = config.list('husky');

    if (huskyList.length > 0) {
      console.log(`Updating husky: ${huskyList.join(', ')}`);

      const husky = pjson.get('husky');

      if (!husky.hooks) {
        husky.hooks = {};
      }

      for (const hookName of huskyList) {
        husky.hooks[hookName] = `yarn sfdx-husky-${hookName}`;
      }
    }
  }

  pjson.write();
};
