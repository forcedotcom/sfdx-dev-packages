#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is the preinstall hook for adding dependencies used by the generated pjson scripts, targets, and files.
 */

const { writeFileSync } = require("fs");
const { join } = require("path");

const buildList = require("../utils/list-from-config");

const genScriptsPre = (packageRoot = require("../utils/package-root")) => {
  const orderMap = require("../utils/order-map");

  const pjsonPath = join(packageRoot, "package.json");
  const pjson = require(pjsonPath);

  const DEFAULT_HUSKY = ["commit-msg"];

  const huskyList = buildList("husky", DEFAULT_HUSKY);

  if (huskyList.length > 0) {
    pjson.devDependencies["husky"] = "^1";
  }

  pjson.devDependencies = orderMap(pjson.devDependencies);

  writeFileSync(pjsonPath, JSON.stringify(pjson, null, 2));
};

genScriptsPre();

module.exports = genScriptsPre;
