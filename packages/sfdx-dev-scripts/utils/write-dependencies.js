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

  if (!inLernaProject && config.list('husky').length > 0) {
    added.push('husky => ^1');
    dependencies['husky'] = '^1';
  }

  if (added.length > 0) {
    console.log(`added\n\t${added.join('\n\t')}`);
  }

  pjson.write();
};
