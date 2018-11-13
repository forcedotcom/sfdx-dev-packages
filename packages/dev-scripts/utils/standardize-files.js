/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { accessSync, writeFileSync } = require('fs');
const log = require('./log');
const exists = require('./exists');
const SfdxDevConfig = require('./sfdx-dev-config');
const PackageJson = require('./package-json');

const addFile = (filePath, strict, config) => {
  const fileExists = exists(filePath);

  // If it is strict, the user shouldn't be overriding anything,
  // so write the file again.
  if (strict || (!strict && !fileExists)) {
    let contents = JSON.stringify(config, null, 2) + '\n';
    if (strict) {
      contents = `// Generated - Do not modify. Controlled by @salesforce/dev-scripts\n${contents}`;
    }
    writeFileSync(filePath, contents);
    return filePath;
  }
};

module.exports = (packageRoot = require('./package-path'), inLernaProject) => {
  const config = new SfdxDevConfig(packageRoot);
  let isLernaProject = false;

  try {
    accessSync(join(packageRoot, 'lerna.json'));
    isLernaProject = true;
  } catch (err) {}

  if (isLernaProject) {
    log('skipping writing files for learn project', 1);
    return;
  }

  log(`standardizing config files for ${new PackageJson(packageRoot).name}`, 1);

  const added = [];
  const removed = [];
  const scriptList = config.list('scripts');

  if (scriptList.length > 0) {
    const nycPath = join(packageRoot, '.nycrc');
    // nyc file
    if (scriptList.includes('test') && !exists(nycPath)) {
      const nyc = {
        nyc: {
          extends: '@salesforce/dev-config/nyc'
        }
      };
      const nycJson = JSON.stringify(nyc, null, 2) + '\n';
      writeFileSync(nycPath, nycJson);
      added.push(nycPath);
    }

    // tslint files
    if (scriptList.includes('lint')) {
      const lintConfig = config.get('lint') || {};
      const strict = config.get('strict') || lintConfig.strict;

      const postfix = strict ? '-strict' : '';
      const addLintFile = (baseDir, baseFile) => {
        const tslintPath = join(baseDir, 'tslint.json');
        const tslint = {
          extends: `@salesforce/dev-config/${baseFile}${postfix}`
        };
        const file = addFile(tslintPath, strict, tslint);
        if (file) {
          added.push(tslintPath);
        }
      };
      addLintFile(packageRoot, 'tslint');
      if (exists(join(packageRoot, 'test'))) {
        addLintFile(join(packageRoot, 'test'), 'tslint-test');
      }
    }

    // tsconfig files
    if (scriptList.includes('compile')) {
      const compileConfig = config.get('compile') || {};
      const strict = config.get('strict') || compileConfig.strict;

      const prefix = inLernaProject ? '../../' : './';
      const postfix = strict ? '-strict' : '';

      const addConfigFile = (baseDir, config) => {
        const tsconfigPath = join(baseDir, 'tsconfig.json');
        const file = addFile(tsconfigPath, strict, config);
        if (file) {
          added.push(tsconfigPath);
        }
      };
      // FIXME: Temporary fix until github.com/Microsoft/TypeScript/issues/18865 is fixed.
      // TODO: Change to @salesforce/devconfig/tsconfig-strict when above is resolved.
      addConfigFile(packageRoot, {
        extends: `${prefix}node_modules/@salesforce/dev-config/tsconfig${postfix}`,
        // This has to live in this file until there is a way to specify a base
        // TODO Update when https://github.com/Microsoft/TypeScript/issues/25430 is fixed
        compilerOptions: {
          outDir: 'lib'
        },
        include: ['./src/**/*.ts']
      });
      if (exists(join(packageRoot, 'test'))) {
        addConfigFile(join(packageRoot, 'test'), {
          extends: `${prefix}../node_modules/@salesforce/dev-config/tsconfig-test${postfix}`,
          // This has to live in this file until there is a way to specify a base
          // TODO Update when https://github.com/Microsoft/TypeScript/issues/25430 is fixed
          include: ['./**/*.ts']
        });
      }
    }
  }
  if (added.length > 0) {
    log(`adding config files ${added.join(', ')}`, 2);
  }
  if (removed.length > 0) {
    log(`removing config files ${removed.join(', ')}`, 2);
  }
};
