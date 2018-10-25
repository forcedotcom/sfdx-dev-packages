/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = (name, defaults = [], config) => {
    if (!name) { throw new Error('config property is not defined'); }
    if (!config) { config = require('./sfdx-dev-config'); }

    let list;

    // If the config overrides the list, use that. Otherwise, clone defaults.
    if (config[name]) {
        list = config[name];
    } else {
        list = defaults.slice();
    }

    if (config[`exclude-${name}`]) {
        list.filter(item => config[`exclude-${name}`].includes(item));
    }
    return list;
}
