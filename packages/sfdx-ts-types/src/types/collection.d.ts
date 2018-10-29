/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @module types
 */

import { Optional } from './union';

/**
 * An object with arbitrary string-indexed values of an optional generic type `Optional<T>`. `T` defaults to `unknown`
 * when not explicitly supplied. For convenient iteration of definitely assigned (i.e. non-nullable) entries, keys,
 * and values, see the following functions: {@link definiteEntries}, {@link definiteKeys}, and {@link definiteValues}.
 */
export interface Dictionary<T = unknown> {
  [key: string]: Optional<T>;
}

/**
 * An alias for an array of `T` elements, where `T` defaults to `unknown`.
 */
export interface AnyArray<T = unknown> extends Array<T> {}

/**
 * Any object with both a numeric index signature with values of type `T` and a numeric `length`
 * property. `T` defaults to `unknown` if unspecified.
 */
export interface AnyArrayLike<T = unknown> extends ArrayLike<T> {}
