/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as Debug from 'debug';

const doTrace = (process.env.LAZY_REQUIRE_TRACE || '').toLowerCase() === 'true';

export const debug = Debug('lazy-require');
export const trace = doTrace
  ? debug
  : (): void => {
      /* do nothing */
    };
