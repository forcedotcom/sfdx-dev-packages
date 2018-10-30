/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  AnyArray,
  AnyArrayLike,
  AnyConstructor,
  AnyFunction,
  AnyJson,
  Dictionary,
  JsonArray,
  JsonMap,
  KeyOf,
  Optional,
  View
} from '../types';

/**
 * Tests whether an `unknown` value is a `string`.
 *
 * @param value The value to test.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Tests whether an `unknown` value is a `number`.
 *
 * @param value The value to test.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Tests whether an `unknown` value is a `boolean`.
 *
 * @param value The value to test.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Tests whether an `unknown` value is an `object` subtype.
 *
 * @param value The value to test.
 */
export function isObject(value: unknown): value is object {
  return value != null && typeof value === 'object';
}

/**
 * Tests whether or not an `unknown` value is a plain JavaScript object.
 *
 * @param value The value to test.
 */
export function isPlainObject(value: unknown): value is object {
  const isObjectObject = (o: unknown): o is Dictionary => {
    return (
      isObject(o) && Object.prototype.toString.call(o) === '[object Object]'
    );
  };
  if (!isObjectObject(value)) return false;
  const ctor = value.constructor;
  if (!isFunction(ctor)) return false;
  if (!isObjectObject(ctor.prototype)) return false;
  if (!ctor.prototype.hasOwnProperty('isPrototypeOf')) return false;
  return true;
}

/**
 * Tests whether an `unknown` value is a `function`.
 *
 * @param value The value to test.
 */
export function isInstance<C extends AnyConstructor>(
  value: unknown,
  ctor: C
): value is InstanceType<C> {
  return value instanceof ctor;
}

/**
 * Tests whether an `unknown` value is an `Array`.
 *
 * @param value The value to test.
 */
export function isArray(value: unknown): value is AnyArray {
  return Array.isArray(value);
}

/**
 * Tests whether an `unknown` value conforms to {@link AnyArrayLike}.
 *
 * @param value The value to test.
 */
export function isArrayLike(value: unknown): value is AnyArrayLike {
  // avoid circular dependency with has.ts
  const hasLength = (v: unknown): v is View<'length', number> =>
    isObject(v) && 'length' in v;
  return !isFunction(value) && (isString(value) || hasLength(value));
}

/**
 * Tests whether an `unknown` value is a `function`.
 *
 * @param value The value to test.
 */
export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function';
}

/**
 * Tests whether `unknown` value is a valid JSON type. Note that objects and arrays are only checked using a shallow
 * test. To be sure that a given value is JSON-compatible at runtime, see {@link toAnyJson}.
 *
 * @param value The value to test.
 */
export function isAnyJson(value: unknown): value is AnyJson {
  return (
    value === null ||
    isString(value) ||
    isNumber(value) ||
    isBoolean(value) ||
    isPlainObject(value) ||
    isArray(value)
  );
}

/**
 * Tests whether an `AnyJson` value is an object.
 *
 * @param value The value to test.
 */
export function isJsonMap(value: Optional<AnyJson>): value is JsonMap {
  return isPlainObject(value);
}

/**
 * Tests whether an `AnyJson` value is an array.
 *
 * @param value The value to test.
 */
export function isJsonArray(value: Optional<AnyJson>): value is JsonArray {
  return isArray(value);
}

/**
 * Tests whether or not a `key` string is a key of the given object type `T`.
 *
 * @param obj The target object to check the key in.
 * @param key The string to test as a key of the target object.
 */
export function isKeyOf<T extends object, K extends KeyOf<T>>(
  obj: T,
  key: string
): key is K {
  return Object.keys(obj).includes(key);
}
