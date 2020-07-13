/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const shell = require('shelljs');
const chalk = require('chalk');

shell.set('-e');
shell.set('+v');

const origExec = shell.exec;

process.env.FORCE_COLOR = '1';

shell.exec = function (command, ...args) {
  // eslint-disable-next-line no-console
  console.log(chalk.blue(command));
  try {
    origExec.call(shell, command, ...args);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(err.message));
    process.exitCode = 1;
  }
};

module.exports = shell;
