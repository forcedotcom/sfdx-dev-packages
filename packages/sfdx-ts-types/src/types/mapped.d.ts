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
 * An alias for the commonly needed `Extract<keyof T, string>`.
 */
export type KeyOf<T> = Extract<keyof T, string>;

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
 * // typeof QUERY_KEY -> {
 * //     [x: number]: number;
 * //     readonly id: number;
 * //     readonly name: number;
 * //     readonly created: number;
 * //     readonly updated: number;
 * // }
 * interface QueryRecord extends LiteralsRecord<typeof QUERY_KEY, string> { }
 * // typeof QueryRecord -> {
 * //     readonly id: string;
 * //     readonly name: string;
 * //     readonly created: string;
 * //     readonly updated: string;
 * // }
 * // And for an interface with writable properties, use the following:
 * interface QueryRecord extends Writable<LiteralsRecord<typeof QUERY_KEY, string>> { }
 * // typeof QueryRecord -> {
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
export type Writable<T> = { -readonly [K in keyof T]: T[K] };
