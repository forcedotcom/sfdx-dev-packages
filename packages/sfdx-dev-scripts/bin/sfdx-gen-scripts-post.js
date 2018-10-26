#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { accessSync, writeFileSync } = require("fs");
const { join } = require("path");

const buildList = require("../utils/list-from-config");
const config = require("../utils/sfdx-dev-config");
const orderMap = require("../utils/order-map");

const genScriptsPost = (
  packageRoot = require("../utils/package-root"),
  isLernaPackage
) => {
  const pjsonPath = join(packageRoot, "package.json");
  const pjson = require(pjsonPath);
  let inLernaRoot = false;

  try {
    accessSync(join(packageRoot, "lerna.json"));
    inLernaRoot = true;
  } catch (err) {}

  console.log(`working with ${pjsonPath}`);

  const DEFAULT_SCRIPTS = ["clean", "clean-all", "compile"]; // TODO add "build", "lint", "docs"]
  const DEFAULT_HUSKY = ["commit-msg", "pre-commit", "pre-push"];

  // GENERATE SCRIPTS
  const scriptList = buildList("scripts", DEFAULT_SCRIPTS, config);

  if (scriptList.length > 0) {
    console.log(`Updating scripts: ${scriptList.join(", ")}`);

    // Init scripts in pjson, if needed
    if (!pjson.scripts) {
      pjson.scripts = {};
    }
    for (const script of scriptList) {
      if (inLernaRoot) {
        pjson.scripts[script] = `lerna run ${script}`;
      } else {
        const scriptArgs = script.split("-");

        // TODO remove, just using this to test the run but don't want to lose the existing compile scripts
        if (!pjson.scripts[script]) {
          if (scriptArgs.length > 1) {
            const scriptName = scriptArgs[0];
            pjson.scripts[
              script
            ] = `yarn sfdx-${scriptName} ${scriptArgs.splice(1).join(" ")}`;
          } else {
            pjson.scripts[script] = `yarn sfdx-${script}`;
          }
        }
      }
    }

    pjson.scripts = orderMap(pjson.scripts);
  }

  // Husky should only be at the root git project (the lerna project)
  if (isLernaPackage) {
    delete pjson.husky;
  } else {
    // GENERATE HUSKY
    const huskyList = buildList("husky", DEFAULT_HUSKY, config);

    if (huskyList.length > 0) {
      console.log(`Updating husky: ${huskyList.join(", ")}`);

      // Init husky in pjson, if needed
      if (!pjson.husky) {
        pjson.husky = {};
      }
      if (!pjson.husky.hooks) {
        pjson.husky.hooks = {};
      }

      for (const husky of huskyList) {
        pjson.husky.hooks[husky] = `yarn sfdx-husky-${husky}`;
      }

      pjson.husky.hooks = orderMap(pjson.husky.hooks);
    }
  }

  writeFileSync(pjsonPath, JSON.stringify(pjson, null, 2) + "\n");
  console.log(`wrote ${pjsonPath}`);
};

genScriptsPost();

module.exports = genScriptsPost;
