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
 * A union type for either the parameterized type `T` or `undefined` -- the opposite of {@link NonOptional}.
 */
export type Optional<T> = T | undefined;

/**
 * A union type for either the parameterized type `T`, `null`, or `undefined` -- the opposite of
 * the `NonNullable` builtin conditional type.
 */
export type Nullable<T> = Optional<T | null>;

/**
 * A union type for either the parameterized type `T` or an array of `T`.
 */
export type Many<T> = T | T[];

/**
 * A union type of `string | number | symbol`, representing all possible types for object property keys.
 */
export type PropertyKey = string | number | symbol;
