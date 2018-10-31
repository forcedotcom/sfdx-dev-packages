#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const shell = require('shelljs');

shell.set('-e');
shell.set('+v');

const defaultDirs = ['lib', '*coverage', '.nyc_output'];
const defaultFiles = ['*xunit.xml', '*checkstyle.xml', 'yarn-error.log'];

const packageRoot = require('../utils/package-path');
const Config = require('../utils/sfdx-dev-config');
const config = new Config(packageRoot);
const clean = config.get('clean');

const cleanAll = process.argv[2] === 'all';

// Add defaults for clean all
if (cleanAll) {
  defaultDirs.push('node_modules');
}

if (!clean || clean.skipDefaults !== true) {
  console.log(`cleaning default directories: ${defaultDirs.join()}`);
  defaultDirs.forEach(dir => {
    shell.rm('-rf', join(packageRoot, dir));
  });
  console.log(`cleaning default files: ${defaultFiles.join()}`);
  defaultFiles.forEach(file => {
    shell.rm('-f', join(packageRoot, file));
  });
}

if (clean && clean.dirs) {
  console.log(`cleaning config directories: ${clean.dirs.join()}`);
  clean.dirs.forEach(dir => {
    shell.rm('-rf', join(packageRoot, dir));
  });
}

if (clean && clean.files) {
  console.log(`cleaning config files: ${clean.files.join()}`);
  clean.files.forEach(file => {
    shell.rm('-f', join(packageRoot, file));
  });
}

if (cleanAll) {
  if (clean && clean.allDirs) {
    console.log(`cleaning config directories: ${clean.allDirs.join()}`);
    clean.allDirs.forEach(dir => {
      shell.rm('-rf', join(packageRoot, dir));
    });
  }

  if (clean && clean.allFiles) {
    console.log(`cleaning config files: ${clean.allFiles.join()}`);
    clean.allFiles.forEach(file => {
      shell.rm('-f', join(packageRoot, file));
    });
  }
}
