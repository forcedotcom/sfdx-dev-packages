/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readdirSync } = require('fs');
const { join } = require('path');
const log = require('./log');
const packageRoot = require('./package-path');

module.exports = (name, script) => {
  // Only get lerna packages that require @salesforce/dev-scripts
  const packageList = readdirSync(join(packageRoot, 'packages')).filter((packageName) => {
    try {
      const pjson = require(join(packageRoot, 'packages', packageName, 'package.json'));
      // TODO should inner packages even depend on this? Maybe it should be at the lerna level only
      return (
        (pjson.dependencies && pjson.dependencies['@salesforce/dev-scripts']) ||
        (pjson.devDependencies && pjson.devDependencies['@salesforce/dev-scripts'])
      );
    } catch (e) {
      console.warn(`Skipping ${packageName} because ${e.message}`);
    }
    return false;
  });

  log(`Running ${name} for packages ${packageList.join(', ')}`);

  let changed = false;
  try {
    for (const dir of packageList) {
      // Run against all packages to update all package.json at once (don't short circuit).
      changed = script(join(packageRoot, 'packages', dir), true) || changed;
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
  return changed;
};
