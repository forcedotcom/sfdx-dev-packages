/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

let chalk;

try {
  // If this is ran in preinstall, chalk won't exist yet.
  chalk = require('chalk');
} catch (err) {}

module.exports = (msg, indent) => {
  let prefix = '> ';
  if (indent) {
    prefix = new Array(indent * 2 + 1).join(' ');
  } else {
    msg = chalk ? chalk.bold(msg) : msg;
  }
  msg = `${prefix}${msg}`;
  console.warn(chalk ? chalk.dim.yellow(msg) : msg);
};
