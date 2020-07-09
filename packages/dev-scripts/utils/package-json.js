/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { writeFileSync } = require('fs');
const { basename, join } = require('path');

const log = require('./log');
const orderMap = require('./order-map');

class PackageJson {
  constructor(packageRoot = require('./package-path')) {
    this.path = packageRoot;
    this.name = basename(packageRoot);
    this.pjsonPath = join(packageRoot, 'package.json');
    this.contents = require(this.pjsonPath);
    this.originalContents = this.stringify();
    this.actions = [];
  }

  stringify() {
    if (this.contents.scripts) {
      this.contents.scripts = orderMap(this.contents.scripts);
    }
    if (this.contents.devDependencies) {
      this.contents.devDependencies = orderMap(this.contents.devDependencies);
    }
    return JSON.stringify(this.contents, null, 2) + '\n';
  }

  write() {
    const pjson = this.stringify();
    if (this.originalContents !== pjson) {
      log(`Found changes for ${this.contents.name}`);
      for (const action of this.actions) {
        log(action, 2);
      }

      writeFileSync(this.pjsonPath, pjson);
      log(`wrote changes to ${this.pjsonPath}`, 1);
    }
  }

  get(name, defaultValue = {}) {
    if (!name) {
      throw new Error('property name is required');
    }
    if (!this.contents[name]) {
      this.contents[name] = defaultValue;
    }
    return this.contents[name];
  }
}

module.exports = PackageJson;
