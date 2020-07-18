/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { readFileSync, unlinkSync, copyFileSync, statSync } = require('fs');
const log = require('./log');
const exists = require('./exists');
const { resolveConfig } = require('./sf-config');
const PackageJson = require('./package-json');
const { isMultiPackageProject } = require('./project-type');

const FILES_PATH = join(__dirname, '..', 'files');

const FILE_NAME_LICENSE = 'LICENSE.txt';
const FILE_NAME_GITIGNORE = 'gitignore';

function isDifferent(sourcePath, targetPath) {
  try {
    if (statSync(sourcePath).size !== statSync(targetPath).size) {
      return true;
    }
    return readFileSync(sourcePath, 'utf8') !== readFileSync(targetPath, 'utf8');
  } catch (error) {
    /* do nothing */
  }
  return true;
}

function copyFile(sourcePath, targetPath, override = false) {
  const fileExists = exists(targetPath);
  const shouldWriteFile = override || !fileExists;

  if (shouldWriteFile && isDifferent(sourcePath, targetPath)) {
    copyFileSync(sourcePath, targetPath);
    return targetPath;
  }
}

function writeLicenseFile(targetDir) {
  const licenseSourcePath = join(FILES_PATH, FILE_NAME_LICENSE);
  const licenseTargetPath = join(targetDir, FILE_NAME_LICENSE);
  // Always keep license file up-to-date
  return copyFile(licenseSourcePath, licenseTargetPath, true);
}

function writeGitignore(targetDir) {
  const gitignoreSourcePath = join(FILES_PATH, FILE_NAME_GITIGNORE);
  const gitignoreTargetPath = join(targetDir, `.${FILE_NAME_GITIGNORE}`);
  // Try to copy the default.
  const copied = copyFile(gitignoreSourcePath, gitignoreTargetPath);

  if (!copied) {
    if (!readFileSync(gitignoreTargetPath, 'utf-8').includes('#-- CLEAN')) {
      log(`The .gitignore doesn't contain any clean entries. See ${gitignoreTargetPath} for examples.`);
    }
  }
  return copied;
}

// eslint-disable-next-line complexity
module.exports = (packageRoot = require('./package-path'), inLernaProject) => {
  const config = resolveConfig(packageRoot, inLernaProject);
  const testPath = join(packageRoot, 'test');
  const scripts = config.scripts;

  let added = [];
  let removed = [];

  // No need to write these file in lerna package directories.
  if (isMultiPackageProject(packageRoot) || !inLernaProject) {
    added.push(writeLicenseFile(packageRoot));
    added.push(writeGitignore(packageRoot));
  }

  // We want prettier in the root since that is when the commit format hook runs
  if (isMultiPackageProject(packageRoot) || scripts.format) {
    const prettierSourcePath = join(FILES_PATH, 'prettierrc.json');
    const prettierTargetPath = join(packageRoot, '.prettierrc.json');
    // prettier config files can't have the header, so it doesn't use a strict mode, meaning, it won't be overridden
    added.push(copyFile(prettierSourcePath, prettierTargetPath, false));
  }

  if (isMultiPackageProject(packageRoot)) {
    log('skipping writing files for learn project', 1);
    return;
  }

  // nyc file
  if (scripts.test) {
    const nycSourcePath = join(FILES_PATH, 'nycrc');
    const nycTargetPath = join(packageRoot, '.nycrc');
    // Allow repos to override their coverage so don't override file
    added.push(copyFile(nycSourcePath, nycTargetPath, false));
  }

  // eslint files
  if (scripts.lint) {
    const lintConfig = config.lint || {};
    const strict = config.strict || lintConfig.strict;

    const eslintSourcePath = join(FILES_PATH, strict ? 'eslintrc-strict.js' : 'eslintrc.js');
    const eslintTargetPath = join(packageRoot, '.eslintrc.js');
    added.push(copyFile(eslintSourcePath, eslintTargetPath, strict));

    if (exists(testPath)) {
      const eslintTestSourcePath = join(FILES_PATH, strict ? 'eslintrc-test-strict.js' : 'eslintrc-test.js');
      const eslintTestTargetPath = join(testPath, '.eslintrc.js');
      added.push(copyFile(eslintTestSourcePath, eslintTestTargetPath, strict));
    }

    // We don't use tslint anymore.
    const tslintPath = join(packageRoot, 'tslint.json');
    if (exists(tslintPath)) {
      unlinkSync(tslintPath);
      removed.push(tslintPath);
    }

    const tslintTestPath = join(testPath, 'tslint.json');
    if (exists(tslintTestPath)) {
      unlinkSync(tslintTestPath);
      removed.push(tslintTestPath);
    }
  }

  // tsconfig files
  if (scripts.compile) {
    const compileConfig = config.compile || {};
    const strict = config.strict || compileConfig.strict;

    const tsconfigSourcePath = join(FILES_PATH, strict ? 'tsconfig-strict.json' : 'tsconfig.json');
    const tsconfigTargetPath = join(packageRoot, 'tsconfig.json');
    added.push(copyFile(tsconfigSourcePath, tsconfigTargetPath, strict));

    if (exists(testPath)) {
      const tsconfigTestSourcePath = join(FILES_PATH, strict ? 'tsconfig-test-strict.json' : 'tsconfig-test.json');
      const tsconfigTestTargetPath = join(testPath, 'tsconfig.json');
      added.push(copyFile(tsconfigTestSourcePath, tsconfigTestTargetPath, strict));
    }
  }

  added = added.filter((a) => !!a);
  removed = removed.filter((a) => !!a);

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
