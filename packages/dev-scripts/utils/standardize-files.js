/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const log = require('./log');
const exists = require('./exists');
const { resolveConfig } = require('./sfdx-dev-config');
const PackageJson = require('./package-json');
const { isMultiPackageProject } = require('./project-type');

const addFile = (filePath, strict, config, addHeader = true) => {
  const fileExists = exists(filePath);

  // If it is strict, the user shouldn't be overriding anything,
  // so write the file again.
  if (strict || (!strict && !fileExists)) {
    let contents = typeof config === 'string' ? config : JSON.stringify(config, null, 2) + '\n';
    if (strict && addHeader) {
      contents = `// Generated - Do not modify. Controlled by @salesforce/dev-scripts\n${contents}`;
    }
    let oldContents;
    try {
      oldContents = readFileSync(filePath, 'utf8');
    } catch (error) {}
    if (oldContents !== contents) {
      writeFileSync(filePath, contents);
      return filePath;
    }
  }
};

module.exports = (packageRoot = require('./package-path'), inLernaProject) => {
  const config = resolveConfig(packageRoot, inLernaProject);

  if (isMultiPackageProject(packageRoot)) {
    log('skipping writing files for learn project', 1);
    return;
  }

  const added = [];
  const removed = [];
  const scripts = config.scripts;

  const nycPath = join(packageRoot, '.nycrc');
  // nyc file
  if (scripts.test && !exists(nycPath)) {
    const nyc = {
      nyc: {
        extends: '@salesforce/dev-config/nyc',
      },
    };
    const nycJson = JSON.stringify(nyc, null, 2) + '\n';
    writeFileSync(nycPath, nycJson);
    added.push(nycPath);
  }

  // eslint files
  if (scripts.lint) {
    const lintConfig = config.lint || {};
    const strict = config.strict || lintConfig.strict;

    const addLintFile = (baseDir, contents) => {
      const eslintPath = join(baseDir, '.eslintrc.js');
      const file = addFile(eslintPath, strict, contents);
      if (file) {
        added.push(eslintPath);
      }
    };
    addLintFile(
      packageRoot,
      `module.exports = {
  extends: 'eslint-config-salesforce-typescript'
}
`
    );
    if (exists(join(packageRoot, 'test'))) {
      addLintFile(
        join(packageRoot, 'test'),
        `module.exports = {
  extends: '../.eslintrc.js',
  // Allow describe and it
  env: { mocha: true },
  rules: {
    // Allow assert style expressions. i.e. expect(true).to.be.true
    "no-unused-expressions": "off"
  }
}
`
      );
    }
  }

  if (scripts.format) {
    const prettierPath = join(packageRoot, '.prettierrc.json');
    // prettier config files can't have the header, so don't pass in strict
    const file = addFile(prettierPath, config.strict, '"@salesforce/dev-config/prettier"', false);
    if (file) {
      added.push(prettierPath);
    }
  }

  // tsconfig files
  if (scripts.compile) {
    const compileConfig = config.compile || {};
    const strict = config.strict || compileConfig.strict;

    const prefix = inLernaProject ? '../../' : './';
    const postfix = strict ? '-strict' : '';

    const addConfigFile = (baseDir, config) => {
      const tsconfigPath = join(baseDir, 'tsconfig.json');
      const file = addFile(tsconfigPath, strict, config);
      if (file) {
        added.push(tsconfigPath);
      }
    };
    addConfigFile(packageRoot, {
      extends: `@salesforce/dev-config/tsconfig${postfix}`,
      // This has to live in this file until there is a way to specify a base
      // TODO Update when https://github.com/Microsoft/TypeScript/issues/25430 is fixed
      compilerOptions: {
        outDir: 'lib',
      },
      include: ['./src/**/*.ts'],
    });
    if (exists(join(packageRoot, 'test'))) {
      addConfigFile(join(packageRoot, 'test'), {
        extends: `@salesforce/dev-config/tsconfig-test${postfix}`,
        // This has to live in this file until there is a way to specify a base
        // TODO Update when https://github.com/Microsoft/TypeScript/issues/25430 is fixed
        include: ['./**/*.ts'],
      });
    }
  }

  if (added.length > 0 || removed.length > 0) {
    log(`standardizing config files for ${new PackageJson(packageRoot).name}`);
  }
  if (added.length > 0) {
    log(`adding config files ${added.join(', ')}`, 2);
  }
  if (removed.length > 0) {
    log(`removing config files ${removed.join(', ')}`, 2);
  }
};
