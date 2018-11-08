/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Nullable } from '../types';

/**
 * Returns the given `value` if not either `undefined` or `null`, or the given `defaultValue` otherwise if defined.
 * Returns `null` if the value is `null` and `defaultValue` is `undefined`.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was not defined.
 * @ignore
 */
export function valueOrDefault<T>(value: Nullable<T>, defaultValue: Nullable<T>): Nullable<T> {
  return value != null || defaultValue === undefined ? value : defaultValue;
}
