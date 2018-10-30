/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');

class SfdxDevConfig {
  constructor(packageRoot = require('./package-path')) {
    let config = {};
    try {
      const configPath = join(packageRoot, '.sfdx-dev.json');
      config = require(configPath);
      console.warn(`found config at ${configPath}`);
    } catch (err) {
      /* The repository doesn't have a config */
    }
    this.contents = config;
  }

  get(name) {
    if (!name) {
      throw new Error('property name is required');
    }
    return this.contents[name];
  }

  list(name) {
    let list;

    if (this.get(name)) {
      // If the config overrides the list, use that.
      list = this.get(name);
    } else {
      // Otherwise, clone defaults.
      const defaults = SfdxDevConfig[`DEFAULT_${name.toUpperCase()}`] || [];
      list = Array.from(defaults);
    }

    if (this.get(`exclude-${name}`)) {
      list = list.filter(item => this.get(`exclude-${name}`).includes(item));
    }
    return list;
  }
}

SfdxDevConfig['DEFAULT_SCRIPTS'] = [
  'clean',
  'clean-all',
  'compile',
  'test',
  'lint'
]; // TODO add "build", "lint", "docs"]
SfdxDevConfig['DEFAULT_HUSKY'] = ['commit-msg', 'pre-commit', 'pre-push'];

module.exports = SfdxDevConfig;
