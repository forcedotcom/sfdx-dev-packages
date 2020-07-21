/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AnyConstructor, AnyFunction, AnyJson, Dictionary, JsonArray, JsonMap, KeyOf, Optional, View } from '../types';

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
 * Tests whether an `unknown` value is an `Object` subtype (e.g., arrays, functions, objects, regexes,
 * new Number(0), new String(''), and new Boolean(true)). Tests that wish to distinguish objects that
 * were created from literals or that otherwise were not created via a non-`Object` constructor and do
 * not have a prototype chain should instead use {@link isPlainObject}.
 *
 * Use of the type parameter `T` to further narrow the type signature of the value being tested is
 * strongly discouraged unless you are completely confident that the value is of the necessary shape to
 * conform with `T`. This function does nothing at either compile time or runtime to prove the value is of
 * shape `T`, so doing so amounts to nothing more than performing a type assertion, which is generally a
 * bad practice unless you have performed some other due diligence in proving that the value must be of
 * shape `T`. Use of the functions in the `has` co-library are useful for performing such full or partial
 * proofs.
 *
 * @param value The value to test.
 */
export function isObject<T = object>(value: unknown): value is T {
  return value != null && (typeof value === 'object' || typeof value === 'function');
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
 * Tests whether or not an `unknown` value is a plain JavaScript object. That is, if it is an object created
 * by the Object constructor or one with a null `prototype`.
 *
 * Use of the type parameter `T` to further narrow the type signature of the value being tested is
 * strongly discouraged unless you are completely confident that the value is of the necessary shape to
 * conform with `T`. This function does nothing at either compile time or runtime to prove the value is of
 * shape `T`, so doing so amounts to nothing more than performing a type assertion, which is generally a
 * bad practice unless you have performed some other due diligence in proving that the value must be of
 * shape `T`. Use of the functions in the `has` co-library are useful for performing such full or partial
 * proofs.
 *
 * @param value The value to test.
 */
export function isPlainObject<T = object>(value: unknown): value is T {
  const isObjectObject = (o: unknown): o is Dictionary =>
    isObject(o) && Object.prototype.toString.call(o) === '[object Object]';
  if (!isObjectObject(value)) return false;
  const ctor = value.constructor;
  if (!isFunction(ctor)) return false;
  if (!isObjectObject(ctor.prototype)) return false;
  // eslint-disable-next-line no-prototype-builtins
  if (!ctor.prototype.hasOwnProperty('isPrototypeOf')) return false;
  return true;
}

/**
 * A shortcut for testing the suitability of a value to be used as a `Dictionary<T>` type.  Shorthand for
 * writing `isPlainObject<Dictionary<T>>(value)`.  While some non-plain-object types are compatible with
 * index signatures, they were less typically used as such, so this function focuses on the 80% case.
 *
 * Use of the type parameter `T` to further narrow the type signature of the value being tested is
 * strongly discouraged unless you are completely confident that the value is of the necessary shape to
 * conform with `T`. This function does nothing at either compile time or runtime to prove the value is of
 * shape `T`, so doing so amounts to nothing more than performing a type assertion, which is generally a
 * bad practice unless you have performed some other due diligence in proving that the value must be of
 * shape `T`. Use of the functions in the `has` co-library are useful for performing such full or partial
 * proofs.
 *
 * @param value The value to test.
 */
export function isDictionary<T = unknown>(value: unknown): value is Dictionary<T> {
  return isPlainObject(value);
}

/**
 * Tests whether an `unknown` value is a `function`.
 *
 * @param value The value to test.
 */
export function isInstance<C extends AnyConstructor>(value: unknown, ctor: C): value is InstanceType<C> {
  return value instanceof ctor;
}

/**
 * Tests whether an `unknown` value is a class constructor that is either equal to or extends another class
 * constructor.
 *
 * @param value The value to test.
 * @param cls The class to test against.
 */
export function isClassAssignableTo<C extends AnyConstructor>(value: unknown, cls: C): value is C {
  // avoid circular dependency with has.ts
  const has = <T, K extends string>(v: T, k: K): v is T & View<K> => isObject(v) && k in v;
  return value === cls || (has(value, 'prototype') && value.prototype instanceof cls);
}

/**
 * Tests whether an `unknown` value is an `Array`.
 *
 * Use of the type parameter `T` to further narrow the type signature of the value being tested is
 * strongly discouraged unless you are completely confident that the value is of the necessary shape to
 * conform with `T`. This function does nothing at either compile time or runtime to prove the value is of
 * shape `T`, so doing so amounts to nothing more than performing a type assertion, which is generally a
 * bad practice unless you have performed some other due diligence in proving that the value must be of
 * shape `T`. Use of the functions in the `has` co-library are useful for performing such full or partial
 * proofs.
 *
 * @param value The value to test.
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Tests whether an `unknown` value conforms to {@link AnyArrayLike}.
 *
 * Use of the type parameter `T` to further narrow the type signature of the value being tested is
 * strongly discouraged unless you are completely confident that the value is of the necessary shape to
 * conform with `T`. This function does nothing at either compile time or runtime to prove the value is of
 * shape `T`, so doing so amounts to nothing more than performing a type assertion, which is generally a
 * bad practice unless you have performed some other due diligence in proving that the value must be of
 * shape `T`. Use of the functions in the `has` co-library are useful for performing such full or partial
 * proofs.
 *
 * @param value The value to test.
 */
export function isArrayLike<T = unknown>(value: unknown): value is ArrayLike<T> {
  // avoid circular dependency with has.ts
  const hasLength = (v: unknown): v is View<'length', number> => isObject(v) && 'length' in v;
  return !isFunction(value) && (isString(value) || hasLength(value));
}

/**
 * Tests whether `unknown` value is a valid JSON type. Note that objects and arrays are only checked using a shallow
 * test. To be sure that a given value is JSON-compatible at runtime, see {@link toAnyJson}.
 *
 * @param value The value to test.
 */
export function isAnyJson(value: unknown): value is AnyJson {
  return (
    value === null || isString(value) || isNumber(value) || isBoolean(value) || isPlainObject(value) || isArray(value)
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
export function isKeyOf<T extends object, K extends KeyOf<T>>(obj: T, key: string): key is K {
  return Object.keys(obj).includes(key);
}
