/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readdirSync } = require('fs');
const { join } = require('path');

const packageRoot = require('./package-path');

module.exports = script => {
  // Only get lerna packages that require @salesforce/dev-scripts
  const packageList = readdirSync(join(packageRoot, 'packages')).filter(
    name => {
      try {
        const pjson = require(join(
          packageRoot,
          'packages',
          name,
          'package.json'
        ));
        return (
          pjson.dependencies['@salesforce/dev-scripts'] ||
          pjson.devDependencies['@salesforce/dev-scripts']
        );
      } catch (e) {}
      return false;
    }
  );

  console.warn(
    `Running '${script && script.name}' for packages ${packageList.join(', ')}`
  );

  try {
    packageList.forEach(dir => {
      // Run against the packages root
      script(join(packageRoot, 'packages', dir), true);
    });
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
};
