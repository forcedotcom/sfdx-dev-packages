/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('shelljs');
const chalk = require('chalk');

shell.set('-e');
shell.set('+v');

const origExec = shell.exec;

process.env.FORCE_COLOR = '1';

shell.exec = function(command, ...args) {
  console.log(chalk.blue(command));
  try {
    origExec.call(shell, command, ...args);
  } catch (err) {
    console.error(chalk.red(err.message));
    process.exitCode = 1;
  }
};

module.exports = shell;
