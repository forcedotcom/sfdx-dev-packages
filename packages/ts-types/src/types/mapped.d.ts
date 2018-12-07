/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @module types
 */

import { Literals } from './conditional';

/**
 * Creates a new `Record` type from the literal properties of a type `T`, assigning their values
 * the to the type `U`.
 *
 * This can be useful for creating interfaces from the keys of an `enum` so that the keys are
 * available at runtime for meta-programming purposes, while both tying the properties of the
 * generated type to the enum keys and remaining as DRY as possible.
 *
 * ```
 * enum QUERY_KEY { id, name, created, updated }
 * // type of QUERY_KEY -> {
 * //     [x: number]: number;
 * //     readonly id: number;
 * //     readonly name: number;
 * //     readonly created: number;
 * //     readonly updated: number;
 * // }
 * interface QueryRecord extends LiteralsRecord<typeof QUERY_KEY, string> { }
 * // type of QueryRecord -> {
 * //     readonly id: string;
 * //     readonly name: string;
 * //     readonly created: string;
 * //     readonly updated: string;
 * // }
 * // And for an interface with writable properties, use the following:
 * interface QueryRecord extends ReadWrite<LiteralsRecord<typeof QUERY_KEY, string>> { }
 * // type of QueryRecord -> {
 * //     id: string;
 * //     name: string;
 * //     created: string;
 * //     updated: string;
 * // }
 * ```
 */
export type LiteralsRecord<T, U> = Record<Literals<T>, U>;

/**
 * Creates a new type that omits keys in union type `K` of a target type `T`.
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Converts readonly properties of a type `T` to writable properties. This is the opposite of the
 * `Readonly<T>` builtin mapped type.
 */
export type ReadWrite<T> = { -readonly [K in keyof T]: T[K] };

/**
 * A view over an `object` with constrainable properties.
 */
export type View<K extends string, V = unknown> = { [_ in K]: V };

/**
 * Returns a new type consisting of all properties declared for an input type `T2` overlaid on the
 * properties of type `T1`. Any definitions in `T2` replace those previously defined in `T1`. This can
 * be useful for redefining the types of properties on `T1` with values from an inline type `T2`, perhaps to
 * change their type or to make them optional.
 *
 * ```
 * type NameAndStringValue = { name: string, value: string }
 * type NameAndOptionalNumericValue = Overwrite<NameAndValue, { value?: number }>
 * // type of NameAndOptionalNumericValue -> { name: string } & { value?: number | undefined }
 * ```
 */
export type Overwrite<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] } & T2;
