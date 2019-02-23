/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const log = require('./log');
const SfdxDevConfig = require('./sfdx-dev-config');
const PackageJson = require('./package-json');
const { isMultiPackageProject } = require('./project-type');

module.exports = (packageRoot = require('./package-path'), inLernaProject) => {
  const config = new SfdxDevConfig(packageRoot);
  const pjson = new PackageJson(packageRoot);

  log(`standardizing scripts for ${pjson.name}`, 1);

  // GENERATE SCRIPTS
  const scriptList = config.list('scripts');

  if (scriptList.length > 0) {
    log(`updating scripts: ${scriptList.join(', ')}`, 2);

    const scripts = pjson.get('scripts');
    for (const script of scriptList) {
      const scriptName = Array.isArray(script) ? script[0] : script;
      const scriptFile = Array.isArray(script) ? script[1] : script;
      if (isMultiPackageProject(packageRoot)) {
        scripts[scriptName] = `lerna run ${scriptName}`;
      } else {
        let scriptArgs = scriptFile.split('-');
        if (scriptArgs.length > 1) {
          const scriptFileName = scriptArgs[0];
          scriptArgs = scriptArgs.splice(1).join(' ');
          scripts[scriptName] = `yarn sfdx-${scriptFileName} ${scriptArgs}`;
        } else {
          scripts[scriptName] = `yarn sfdx-${scriptFile}`;
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
      log(`updating husky: ${huskyList.join(', ')}`, 2);

      const husky = pjson.get('husky');

      if (!husky.hooks) {
        husky.hooks = {};
      }

      for (const hookName of huskyList) {
        husky.hooks[hookName] = `yarn sfdx-husky-${hookName}`;
      }
    }
  }

  try {
    const tsconfig = readFileSync(join(packageRoot, 'tsconfig.json')).toString();
    // Don't control for non dev-config projects, or projects that don't specify an engine already.
    if (
      tsconfig.match(/"extends"\s*:\s*\".*@salesforce\/dev-config/) &&
      pjson.contents.engines &&
      pjson.contents.engines.node
    ) {
      // Because tsconfig in dev-config compiles to 2017, it should require node >= 8.4
      pjson.contents.engines.node = '>=8.4.0';
    }
  } catch (err) {
    // Don't control for non typescript projects.
  }

  pjson.write();
};
