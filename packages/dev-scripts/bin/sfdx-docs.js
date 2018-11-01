#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('shelljs');

shell.set('-e');
shell.set('+v');

// rm -rf docs/* && typedoc --out docs

const packageRoot = require('../utils/package-path');
const typedoc = require.resolve('typedoc/bin/typedoc');

const options = require('@salesforce/dev-config/typedoc');

try {
  const definedOptions = require(`${packageRoot}/typedoc`);
  options = Object.assign(options, definedOptions);
} catch (err) {}

let command = `${typedoc} --out docs`;

// typedocs does not allow extending configs, so merge the
// defaults and overrides and put them on the command
for (const key of Object.keys(options)) {
  const val = options[key];
  if (typeof val === 'boolean') {
    if (val) {
      command += ` --${key}`;
    }
  } else {
    command += ` --${key} ${val}`;
  }
}

shell.rm('-rf', 'docs/*');
console.log(command);
try {
  shell.exec(command, {
    cwd: packageRoot
  });
} catch (err) {
  process.exitCode = 1;
}
