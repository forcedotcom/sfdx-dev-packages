/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { isMultiPackageProject } = require('../utils/project-type');
const PackageJson = require('./package-json');
const { resolveConfig } = require('./sf-config');

module.exports = (projectPath, inLernaProject) => {
  const pjson = new PackageJson(projectPath);

  const config = resolveConfig(projectPath, inLernaProject);
  const dependencies = pjson.get('devDependencies');

  const added = [];
  const removed = [];

  const devScriptsPjson = require(join(__dirname, '..', 'package.json'));
  const add = (name, version) => {
    version = version || devScriptsPjson.dependencies[name] || devScriptsPjson.devDependencies[name];
    if (!version) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Version empty for ${name}. Make sure it is in the devDependencies in dev-scripts since it is being added to the actual projects devDependencies.`
      );
    }
    if (!dependencies[name] || dependencies[name] !== version) {
      dependencies[name] = version;
      added.push(name);
    }
  };

  const remove = (name) => {
    if (dependencies[name]) {
      delete dependencies[name];
      removed.push(name);
    }
  };

  const scripts = config.scripts;

  if (Object.keys(config.husky).length > 0) {
    // Only add husky hooks at the root level.
    if (!inLernaProject) {
      add('husky');
      if (config.husky['pre-commit']) {
        add('pretty-quick');
      } else {
        remove('pretty-quick');
      }
    } else {
      remove('husky');
    }
  }

  if (scripts.format) {
    add('prettier');
  } else {
    remove('prettier');
  }

  // We don't need to install these for root lerna packages. They will be installed for the packages.
  if (!inLernaProject) {
    return;
  }

  // ensure all are on the same versions
  add('typescript');
  add('@salesforce/dev-config');

  // Included by dev-scripts
  add('nyc');
  add('ts-node');
  add('mocha');
  add('sinon');
  add('chai');

  remove('@commitlint/cli');
  remove('@commitlint/config-conventional');
  remove('source-map-support');
  remove('xunit-file');
  remove('@types/chai');
  remove('@types/mocha');
  remove('@types/node');
  remove('@types/sinon');
  remove('typedoc');
  remove('typedoc-plugin-external-module-name');

  // We use eslint now
  remove('tslint');

  add('@salesforce/prettier-config');

  const eslintPjson = require('eslint-config-salesforce-typescript/package.json');
  const eslintHeaderPjson = require('eslint-config-salesforce-license/package.json');
  if (isMultiPackageProject(projectPath)) {
    // We don't need these at the lerna level
    Object.keys(eslintPjson.devDependencies).forEach(remove);
  } else {
    add('eslint-config-salesforce');
    add('eslint-config-salesforce-typescript');
    add('eslint-config-salesforce-license');
    // eslint and all plugins must be installed on a local bases, regardless of if it uses a shared config.
    // https://eslint.org/docs/user-guide/getting-started
    Object.entries(eslintPjson.devDependencies).forEach(([name, version]) => add(name, version));
    Object.entries(eslintHeaderPjson.devDependencies).forEach(([name, version]) => add(name, version));
  }

  if (added.length > 0) {
    pjson.actions.push(`adding required devDependencies ${added.join(', ')}`);
  }

  if (removed.length >= 0) {
    pjson.actions.push('removed devDependencies controlled by dev-scripts');
  }

  pjson.write();
  return added.length > 0;
};
