/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * An alias for the commonly needed `Extract<keyof T, string>`.
 */
export type KeyOf<T> = Extract<keyof T, string>;

/**
 * An alias for a tuple of type `[string, T]' for a given generic type `T`. `T` defaults to `unknown` if not otherwise
 * defined.
 */
export type KeyValue<T = unknown> = [string, T];
