/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const PackageJson = require('./package-json');
const SfdxDevConfig = require('./sfdx-dev-config');

module.exports = (projectPath, inLernaProject) => {
  const pjson = new PackageJson(projectPath);

  console.log(`adding dependencies to ${pjson.pjsonPath}`);

  const config = new SfdxDevConfig(projectPath);
  const dependencies = pjson.get('devDependencies');

  const added = [];
  const removed = [];

  const remove = name => {
    if (dependencies[name]) {
      delete dependencies[name];
      removed.push(name);
    }
  };

  if (config.list('husky').length > 0) {
    if (!inLernaProject) {
      added.push('husky => ^1');
      dependencies['husky'] = '^1';
    } else {
      remove('husky');
    }
  }

  // Included by dev-scripts
  remove('nyc');
  remove('typescript');
  remove('source-map-support');
  remove('tslint');
  remove('xunit-file');
  remove('sinon');
  remove('mocha');
  remove('chai');
  remove('@types/chai');
  remove('@types/mocha');
  remove('@types/node');
  remove('@types/sinon');
  remove('typedoc');
  remove('typedoc-plugin-external-module-name');
  remove('prettier');
  remove('pretty-quick');

  if (added.length > 0) {
    console.log(`added\n\t${added.join('\n\t')}`);
  }

  pjson.write();
};
