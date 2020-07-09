/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const log = require('./log');
const { resolveConfig } = require('./sfdx-dev-config');
const PackageJson = require('./package-json');
const { isMultiPackageProject } = require('./project-type');

module.exports = (packageRoot = require('./package-path'), inLernaProject) => {
  const config = resolveConfig(packageRoot, inLernaProject);
  const pjson = new PackageJson(packageRoot);

  // GENERATE SCRIPTS
  const scriptList = Object.entries(config.scripts);

  if (scriptList.length > 0) {
    const scriptsChanged = [];

    const scripts = pjson.get('scripts');
    for (let [scriptName, scriptCommand] of scriptList) {
      if (isMultiPackageProject(packageRoot)) {
        scriptCommand = `lerna run ${scriptName}`;
      }

      if (scripts[scriptName] !== scriptCommand) {
        scripts[scriptName] = scriptCommand;
        scriptsChanged.push(scriptName);
      }
    }
    pjson.actions.push(`standardizing scripts: ${scriptsChanged.join(', ')}`);
  }

  // Husky should only be at the root git project (the lerna project)
  if (inLernaProject) {
    if (pjson.contents.husky) {
      pjson.actions.push('removing husky scripts; they should only be on the lerna package.json');
      delete pjson.contents.husky;
    }
  } else {
    // GENERATE HUSKY
    const huskyList = Object.keys(config.husky);

    if (huskyList.length > 0) {
      pjson.actions.push(`standardizing husky: ${huskyList.join(', ')}`);

      const husky = pjson.get('husky');

      if (!husky.hooks) {
        husky.hooks = {};
      }

      const standardizedHuskyScripts = [];
      for (const [hookName, huskyScript] of Object.entries(config.husky)) {
        if (husky.hooks[hookName] !== huskyScript) {
          husky.hooks[hookName] = huskyScript;
          standardizedHuskyScripts.push(hookName);
        }
      }
      if (standardizedHuskyScripts.length > 0) {
        pjson.actions.push(`standardize husky scripts ${standardizedHuskyScripts.join(', ')}`);
      }
    }
  }

  try {
    const tsconfig = readFileSync(join(packageRoot, 'tsconfig.json')).toString();
    const engineVersion = '>=12.0.0';
    // Don't control for non dev-config projects, or projects that don't specify an engine already.
    if (
      tsconfig.match(/"extends"\s*:\s*\".*@salesforce\/dev-config/) &&
      pjson.contents.engines &&
      pjson.contents.engines.node &&
      pjson.contents.engines.node !== engineVersion
    ) {
      pjson.actions.push('updating node engine');
      // Because tsconfig in dev-config compiles to 2017, it should require node >= 8.0. However
      // we require 8.4 to match other repos. We will bump this if we compile to 2018.
      pjson.contents.engines.node = engineVersion;
    }
  } catch (err) {
    // Don't control for non typescript projects.
  }

  pjson.write();
};
