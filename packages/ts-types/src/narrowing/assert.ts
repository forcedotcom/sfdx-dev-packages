/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AssertionFailedError } from '../errors';
import { AnyArray, AnyConstructor, AnyFunction, AnyJson, JsonArray, JsonMap, Nullable, Optional } from '../types';
import {
  asArray,
  asBoolean,
  asDictionary,
  asFunction,
  asInstance,
  asJsonArray,
  asJsonMap,
  asNumber,
  asObject,
  asPlainObject,
  asString,
} from './as';
import { toAnyJson } from './to';

/**
 * Asserts that a given `condition` is true, or raises an error otherwise.
 *
 * @param condition The condition to test.
 * @param message The error message to use if the condition is false.
 * @throws {@link AssertionFailedError} If the assertion failed.
 */
export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionFailedError(message || 'Assertion condition was false');
  }
}

/**
 * Narrows a type `Nullable<T>` to a `T` or raises an error.
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
 * @param message The error message to use if `value` is `undefined` or `null`.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertNonNull<T = unknown>(value: Nullable<T>, message?: string): asserts value is T {
  assert(value != null, message || 'Value is not defined');
}

/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertString(value: unknown, message?: string): asserts value is string {
  assertNonNull(asString(value), message || 'Value is not a string');
}

/**
 * Narrows an `unknown` value to a `number` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertNumber(value: unknown, message?: string): asserts value is number {
  assertNonNull(asNumber(value), message || 'Value is not a number');
}

/**
 * Narrows an `unknown` value to a `boolean` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertBoolean(value: unknown, message?: string): asserts value is boolean {
  assertNonNull(asBoolean(value), message || 'Value is not a boolean');
}

/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertObject(value: unknown, message?: string): asserts value is object {
  assertNonNull(asObject(value), message || 'Value is not an object');
}

/**
 * Narrows an `unknown` value to an `object` if it is type-compatible and tests positively with {@link isPlainObject},
 * or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertPlainObject(value: unknown, message?: string): asserts value is object {
  assertNonNull(asPlainObject(value), message || 'Value is not an object');
}

/**
 * Narrows an `unknown` value to a `Dictionary<T>` if it is type-compatible and tests positively
 * with {@link isDictionary}, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertDictionary(value: unknown, message?: string): asserts value is object {
  assertNonNull(asDictionary(value), message || 'Value is not an object');
}

/**
 * Narrows an `unknown` value to instance of constructor type `T` if it is type-compatible, or raises an error
 * otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertInstance<C extends AnyConstructor>(
  value: unknown,
  ctor: C,
  message?: string
): asserts value is InstanceType<C> {
  assertNonNull(asInstance(value, ctor), message || `Value is not an instance of ${ctor.name}`);
}

/**
 * Narrows an `unknown` value to an `Array` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertArray(value: unknown, message?: string): asserts value is AnyArray {
  assertNonNull(asArray(value), message || 'Value is not an array');
}

/**
 * Narrows an `unknown` value to an `AnyFunction` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertFunction(value: unknown, message?: string): asserts value is AnyFunction {
  assertNonNull(asFunction(value), message || 'Value is not a function');
}

/**
 * Narrows an `unknown` value to an `AnyJson` if it is type-compatible, or returns `undefined` otherwise.
 *
 * See also caveats noted in {@link isAnyJson}.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was not a JSON value type.
 */
export function assertAnyJson(value: unknown, message?: string): asserts value is AnyJson {
  assertNonNull(toAnyJson(value), message || 'Value is not a JSON-compatible value type');
}

/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertJsonMap(value: Optional<AnyJson>, message?: string): asserts value is JsonMap {
  assertNonNull(asJsonMap(value), message || 'Value is not a JsonMap');
}

/**
 * Narrows an `AnyJson` value to a `JsonArray` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link AssertionFailedError} If the value was undefined.
 */
export function assertJsonArray(value: Optional<AnyJson>, message?: string): asserts value is JsonArray {
  assertNonNull(asJsonArray(value), message || 'Value is not a JsonArray');
}
