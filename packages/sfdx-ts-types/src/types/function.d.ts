/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @module types
 */

/**
 * Any `function` returning type `T`. `T` defaults to `unknown` when not explicitly supplied.
 */
export type AnyFunction<T = unknown> = (...args: unknown[]) => T;

/**
 * A constructor for any type `T`. `T` defaults to `object` when not explicitly supplied.
 */
export type AnyConstructor<T = object> = new (...args: unknown[]) => T;
