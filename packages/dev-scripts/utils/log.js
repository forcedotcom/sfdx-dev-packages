/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const chalk = require('chalk');

module.exports = (msg, indent) => {
  let prefix = '> ';
  if (indent) {
    prefix = new Array(indent * 2 + 1).join(' ');
  } else {
    msg = chalk.bold(msg);
  }
  msg = `${prefix}${msg}`;
  // eslint-disable-next-line no-console
  console.warn(chalk.dim.yellow(msg));
};
