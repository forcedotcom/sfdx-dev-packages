/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { writeFileSync } = require('fs');
const { join } = require('path');

const orderMap = require('./order-map');

class PackageJson {
  constructor(packageRoot = require('./package-path')) {
    this.path = packageRoot;
    this.pjsonPath = join(packageRoot, 'package.json');
    this.contents = require(this.pjsonPath);
    this.originalContents = this.stringify();
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
      writeFileSync(this.pjsonPath, pjson);
      console.log(`wrote changes to ${this.pjsonPath}`);
    } else {
      console.log('package.json not changed; skipping write');
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
