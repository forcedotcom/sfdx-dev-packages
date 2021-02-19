/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// NOTE TO MAINTAINERS:
//
// This module exports replacements for several lodash functions with a much smaller footprint than relying
// on a full lodash build, or a partial build plus full lodash typings would provide. The downside is that
// in order to expand on this set, we must do the following:
//
// * Update scripts/build-lodash.sh with the new target function name.
// * Rebuild and commit the resulting vendor/lodash.js file using `yarn lodash`.
// * Manually copy, prune, and edit (if necessary) the new fn's typings from the lodash typing.
// * Add tests that verify the expected type signatures... at a minimum, add tests for the relevant fn examples
//   published in the lodash documentation for that fn.

import { AnyFunction, Dictionary, Many, Nullable, Optional } from '@salesforce/ts-types';
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore ignore the demand for typings for the locally built lodash
import * as _ from '../../vendor/lodash';
import { ListIteratee, NumericDictionary, ObjectIteratee, Omit, ValueIteratee, ValueIterateeCustom } from './support';

/**
 * Assigns own enumerable properties of source object(s) to the destination object for all destination
 * properties that resolve to undefined. Once a property is set, additional values of the same property are
 * ignored.
 *
 * Note: This method mutates `obj`.
 *
 * @param obj The destination object.
 * @param sources The source objects.
 */
export function defaults<T, S>(obj: T, source: S): S & T;
/**
 * @see defaults
 */
export function defaults<T, S1, S2>(obj: T, source1: S1, source2: S2): S2 & S1 & T;
/**
 * @see defaults
 */
export function defaults<T, S1, S2, S3>(obj: T, source1: S1, source2: S2, source3: S3): S3 & S2 & S1 & T;
/**
 * @see defaults
 */
export function defaults<T, S1, S2, S3, S4>(
  obj: T,
  source1: S1,
  source2: S2,
  source3: S3,
  source4: S4
): S4 & S3 & S2 & S1 & T;
/**
 * @see defaults
 */
export function defaults<T>(obj: T): T;
// underlying function
export function defaults(obj: unknown, ...otherArgs: unknown[]): unknown {
  return _.defaults(obj, ...otherArgs);
}

/**
 * This method is like `find` except that it returns the key of the first element predicate returns truthy for
 * instead of the element itself.
 *
 * @param obj The object to search.
 * @param predicate The function invoked per iteration.
 */
export function findKey<T>(obj: Nullable<T>, predicate?: ObjectIteratee<T>): Optional<string> {
  return _.findKey(obj, predicate);
}

/**
 * Checks if target is in collection using SameValueZero for equality comparisons. If fromIndex is negative,
 * it’s used as the offset from the end of collection.
 *
 * @param collection The collection to search.
 * @param target The value to search for.
 * @param fromIndex The index to search from.
 */
export function includes<T>(
  collection: Nullable<ArrayLike<T> | Dictionary<T> | NumericDictionary<T>>,
  target: T,
  fromIndex?: number
): boolean {
  return _.includes(collection, target, fromIndex);
}

/**
 * Creates an object composed of keys generated from the results of running each element of collection through
 * iteratee. The corresponding value of each key is the last element responsible for generating the key. The
 * iteratee function is invoked with one argument: (value).
 *
 * @param collection The collection to iterate over.
 * @param iteratee The function invoked per iteration.
 */
export function keyBy<T>(
  collection: Nullable<ArrayLike<T>>,
  iteratee?: ValueIterateeCustom<T, PropertyKey>
): Dictionary<T>;
/**
 * @see keyBy
 */
export function keyBy<T extends object>(
  collection: Nullable<T>,
  iteratee?: ValueIterateeCustom<T[keyof T], PropertyKey>
): Dictionary<T[keyof T]>;
// underlying function
export function keyBy(collection: unknown, iteratee?: unknown): unknown {
  return _.keyBy(collection, iteratee);
}

/**
 * This method creates an object with the same values as object and keys generated
 * by running each own enumerable property of object through iteratee.
 *
 * @param obj The object to iterate over.
 * @param iteratee The function invoked per iteration.
 */
export function mapKeys<T>(object: Nullable<ArrayLike<T>>, iteratee?: ListIteratee<T>): Dictionary<T>;
/**
 * @see mapKeys
 */
export function mapKeys<T extends object>(object: Nullable<T>, iteratee?: ObjectIteratee<T>): Dictionary<T[keyof T]>;
// underlying function
export function mapKeys(obj: unknown, iteratee?: unknown): unknown {
  return _.mapKeys(obj, iteratee);
}

/**
 * This method is like `_.min` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @param array The array to iterate over.
 * @param iteratee The iteratee invoked per element.
 */
export function minBy<T>(collection: Nullable<ArrayLike<T>>, iteratee?: ValueIteratee<T>): Optional<T> {
  return _.minBy(collection, iteratee);
}

/**
 * This method is like `_.max` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @param array The array to iterate over.
 * @param iteratee The iteratee invoked per element.
 */
export function maxBy<T>(collection: Nullable<ArrayLike<T>>, iteratee?: ValueIteratee<T>): Optional<T> {
  return _.maxBy(collection, iteratee);
}

/**
 * Recursively merges own and inherited enumerable properties of source
 * objects into the destination object, skipping source properties that resolve
 * to `undefined`. Array and plain object properties are merged recursively.
 * Other objects and value types are overridden by assignment. Source objects
 * are applied from left to right. Subsequent sources overwrite property
 * assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @param object The destination object.
 * @param sources The source objects.
 */
export function merge<T, S>(object: T, source: S): T & S;
/**
 * @see merge
 */
export function merge<T, S1, S2>(object: T, source1: S1, source2: S2): T & S1 & S2;
/**
 * @see merge
 */
export function merge<T, S1, S2, S3>(object: T, source1: S1, source2: S2, source3: S3): T & S1 & S2 & S3;
/**
 * @see merge
 */
export function merge<T, S1, S2, S3, S4>(
  object: T,
  source1: S1,
  source2: S2,
  source3: S3,
  source4: S4
): T & S1 & S2 & S3 & S4;
// underlying function
export function merge(obj: unknown, ...otherArgs: unknown[]): unknown {
  return _.merge(obj, ...otherArgs);
}

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable properties of `object` that are not omitted.
 *
 * @param obj The source object.
 * @param paths The property names to omit, specified individually or in arrays..
 */
export function omit<T extends Dictionary<unknown>>(obj: Nullable<T>, ...paths: Array<Many<PropertyKey>>): T;
/**
 * @see omit
 */
export function omit<T extends object, K extends keyof T>(obj: Nullable<T>, ...paths: Array<Many<K>>): Omit<T, K>;
/**
 * @see omit
 */
export function omit<T extends object>(obj: Nullable<T>, ...paths: Array<Many<PropertyKey>>): Partial<T>;
// underlying function
export function omit(obj: unknown, ...paths: unknown[]): unknown {
  return _.omit(obj, ...paths);
}

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls to the function return the value
 * of the first call. The `func` is invoked with the this binding and arguments of the created function.
 *
 * @param func The function to restrict.
 */
export function once<T extends AnyFunction>(func: T): T {
  return _.once(func);
}

/**
 * Sets the value at path of object. If a portion of path doesn’t exist it’s created. Arrays are created for
 * missing index properties while objects are created for all other missing properties. Use _.setWith to
 * customize path creation.
 *
 * @param obj The object to modify.
 * @param path The path of the property to set.
 * @param value The value to set.
 */
export function set<T extends object>(obj: T, path: string, value: unknown): T;
/**
 * @see set
 */
export function set<R>(obj: object, path: string, value: unknown): R;
// underlying function
export function set(obj: unknown, path: string, value: unknown): unknown {
  return _.set(obj, path, value);
}

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection through each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @param collection The collection to iterate over.
 * @param iteratees The iteratees to sort by, specified individually or in arrays.
 */
export function sortBy<T>(collection: Nullable<ArrayLike<T>>, ...iteratees: Array<Many<ListIteratee<T>>>): T[];
/**
 * @see sortBy
 */
export function sortBy<T extends object>(
  collection: Nullable<T>,
  ...iteratees: Array<Many<ObjectIteratee<T>>>
): Array<T[keyof T]>;
// underlying function
export function sortBy(collection: unknown, ...iteratees: unknown[]): unknown {
  return _.sortBy(collection, ...iteratees);
}

/**
 * Converts `value` to a number.
 *
 * @param value The value to process.
 *
 * ```
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 * ```
 */
export function toNumber(value: unknown): number {
  return _.toNumber(value);
}
