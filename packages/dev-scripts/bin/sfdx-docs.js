#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readdirSync, readFileSync, statSync, writeFileSync } = require('fs');
const { basename, join, resolve } = require('path');
const shell = require('../utils/shelljs');

const loadRootPath = require('../utils/load-root-path');
const packageRoot = require('../utils/package-path');
const { isMultiPackageProject } = require('../utils/project-type');
const typedoc = require.resolve('typedoc/bin/typedoc');

const options = require('@salesforce/dev-config/typedoc');

try {
  const definedOptions = require(`${packageRoot}/typedoc`);
  options = Object.assign(options, definedOptions);
} catch (err) {}

let outDir = 'docs';

if (isMultiPackageProject(packageRoot)) {
  try {
    const lernaPath = loadRootPath('lerna.json');
    outDir = join(lernaPath, outDir, basename(packageRoot));
    // clean docs _after_ resolving outDir in multi-package projects
    shell.rm('-rf', `${outDir}/*`);
  } catch (e) {}
} else {
  // clean docs _before_ resolving tmp outDir in multi-package projects
  shell.rm('-rf', `${outDir}/*`);
  outDir = join(packageRoot, outDir, 'tmp');
}

let command = `${typedoc} --out ${outDir}`;

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

shell.exec(command, {
  cwd: packageRoot
});

if (!isMultiPackageProject(packageRoot)) {
  shell.mv(`${outDir}/*`, `${outDir}/..`);
  shell.rm('-rf', `${outDir}`);
}

// Fix any leaked local paths in the generated docs
// See https://github.com/TypeStrong/typedoc/issues/800.

const cleanDocFiles = dirPath => {
  for (const file of readdirSync(dirPath)) {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      cleanDocFiles(filePath);
    } else {
      const regex = /Defined in .*[\/\\]node_modules[\/\\](.*:\d+)/g;
      let fileContents = readFileSync(filePath).toString();
      if (fileContents.match(regex)) {
        fileContents = fileContents.replace(regex, (match, group1) => {
          group1 = group1.replace(/\\/g, '/');
          return `Defined in ${group1}`;
        });
        writeFileSync(filePath, fileContents);
      }
    }
  }
};

if (isMultiPackageProject(packageRoot)) {
  cleanDocFiles(outDir);
} else {
  cleanDocFiles(resolve(`${outDir}/..`));
}
