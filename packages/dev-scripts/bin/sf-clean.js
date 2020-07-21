#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const shell = require('../utils/shelljs');
const log = require('../utils/log');
const loadRootPath = require('../utils/load-root-path');

const cleanAll = process.argv[2] === 'all';

let toClean = ['lib'];
let toCleanAll = ['node_modules'];

// Look for the gitignore in case we are in a lerna project
const gitignorePath = loadRootPath('.gitignore');

if (gitignorePath) {
  const VALID_SEGMENTS = ['CLEAN', 'CLEAN ALL'];
  const gitignore = readFileSync(join(gitignorePath, '.gitignore'), 'utf8');
  const segments = gitignore
    // Segments are defined by "# --" in the gitignore
    .split('# --')
    // Turn each segment into list of valid gitignore lines
    .map((segment) => segment.split('\n').filter((line) => line && !line.startsWith('#')))
    // Maps segment name to list of valid gitignore lines
    .reduce((map, segment) => {
      const segmentName = (segment.shift() || '').trim();
      if (VALID_SEGMENTS.includes(segmentName)) {
        map[segmentName] = segment;
      }
      return map;
    }, {});

  // The first line of the segment is what we are looking for. Either # -- CLEAN or # -- CLEAN ALL
  if (segments['CLEAN']) {
    toClean = segments['CLEAN'];
  } else {
    const example = join(__dirname, '..', 'files', '.gitignore');
    log(
      'No clean entries found.' +
        'Use "# -- CLEAN" and # -- CLEAN-ALL to specify clean  directories.' +
        `See ${example} for an example.`
    );
  }
  if (segments['CLEAN ALL']) {
    toCleanAll = segments['CLEAN ALL'];
  }
}

// Add defaults for clean all
if (cleanAll) {
  toClean = [...toClean, ...toCleanAll];
}

log(`rm -rf ${toClean}`);
shell.rm('-rf', toClean);
