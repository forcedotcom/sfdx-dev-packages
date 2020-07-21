#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('../utils/shelljs');

// Simple one line command. If it needs to be customized, override script in sfdevrc file.
shell.exec(`eslint "src/**/*.ts" "test/**/*.ts"`);
