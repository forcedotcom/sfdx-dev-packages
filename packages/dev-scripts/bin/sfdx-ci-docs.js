#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');
const path = require('path');
const packageRoot = require('../utils/package-path');

shell.exec('yarn compile', {
  cwd: packageRoot
});

shell.set('+e');
shell.exec('git worktree add docs gh-pages', {
  cwd: packageRoot
});
shell.set('-e');

shell.exec('yarn docs', {
  cwd: packageRoot
});

shell.exec('cp README.md docs', {
  cwd: packageRoot
});

shell.set('+e');
shell.exec('git add .', {
  cwd: path.join(packageRoot, 'docs')
});

shell.exec('git commit -m "docs: publishing gh-pages"', {
  cwd: path.join(packageRoot, 'docs')
});

shell.exec('git push origin gh-pages', {
  cwd: path.join(packageRoot, 'docs')
});
shell.set('-e');
