#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readdirSync } = require('fs');
const { join } = require('path');
const shell = require('shelljs');

shell.set('-e');
shell.set('+v');

const defaultDirs = [
    'lib',
    '*coverage',
    '.nyc_output'
];
const defaultFiles = [
    '*xunit.xml',
    '*checkstyle.xml',
    'yarn-error.log'
];

const packageRoot = require('../utils/package-root');
const config = require('../utils/sfdx-dev-config');

const cleanAll = process.argv[2] === 'all';

// Add defaults for clean all
if (cleanAll) {
    defaultDirs.push('node_modules'); 
}

if (!config.clean || config.clean.skipDefaults !== true) {
    console.log(`cleaning default directories: ${defaultDirs.join()}`);
    defaultDirs.forEach(dir => {
        shell.rm('-rf', join(packageRoot, dir));
    });
    console.log(`cleaning default files: ${defaultFiles.join()}`);
    defaultFiles.forEach(file => {
        shell.rm('-f', join(packageRoot, file));
    });
}

if (config.clean && config.clean.dirs) {
    console.log(`cleaning config directories: ${config.clean.dirs.join()}`);
    config.clean.dirs.forEach(dir => {
        shell.rm('-rf', join(packageRoot, dir));
    });
}

if (config.clean && config.clean.files) {
    console.log(`cleaning config files: ${config.clean.files.join()}`);
    config.clean.files.forEach(file => {
        shell.rm('-f', join(packageRoot, file));
    });
}

if (cleanAll) {
    if (config.clean && config.clean.allDirs) {
        console.log(`cleaning config directories: ${config.clean.allDirs.join()}`);
        config.clean.allDirs.forEach(dir => {
            shell.rm('-rf', join(packageRoot, dir));
        });
    }
    
    if (config.clean && config.clean.allFiles) {
        console.log(`cleaning config files: ${config.clean.allFiles.join()}`);
        config.clean.allFiles.forEach(file => {
            shell.rm('-f', join(packageRoot, file));
        });
    }
}

