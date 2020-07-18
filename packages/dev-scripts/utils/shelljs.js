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
  const options = Object.assign(
    {
      /* Set any defaults here */
    },
    args[0]
  );
  if (options.passthrough) {
    command = `${command} ${process.argv.slice(2).join(' ')}`;
  }
  // eslint-disable-next-line no-console
  console.error(chalk.blue(command));
  try {
    origExec.call(shell, command, ...args);
  } catch (err) {
    // Setting -e will throw an error. We are already displaying the command
    // output above which has information on the problem, so don't show the
    // node specific error thrown by shelljs. This is much cleaner output.
    process.exit(1);
  }
};

module.exports = shell;
