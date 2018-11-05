/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const chalk = require('chalk');

module.exports = (msg, indent) => {
  let prefix = '> ';
  if (indent) {
    prefix = new Array(indent * 2 + 1).join(' ');
  } else {
    msg = chalk.bold(msg);
  }
  console.warn(chalk.dim.yellow(`${prefix}${msg}`));
};
