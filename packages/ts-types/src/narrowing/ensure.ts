/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { UnexpectedValueTypeError } from '../errors';
import { AnyArray, AnyConstructor, AnyFunction, AnyJson, JsonArray, JsonMap, Nullable, Optional } from '../types';
import { asArray, asBoolean, asFunction, asInstance, asJsonArray, asJsonMap, asNumber, asObject, asString } from './as';
import { isAnyJson } from './is';
import { toAnyJson } from './to';

/**
 * Narrows a type `Nullable<T>` to a `T` or raises an error.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is `undefined` or `null`.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensure<T>(value: Nullable<T>, message?: string): T {
  if (value == null) {
    throw new UnexpectedValueTypeError(message || 'Value is undefined');
  }
  return value;
}

/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureString(value: unknown, message?: string): string {
  return ensure(asString(value), message || 'Value is not an string');
}

/**
 * Narrows an `unknown` value to a `number` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureNumber(value: unknown, message?: string): number {
  return ensure(asNumber(value), message || 'Value is not an number');
}

/**
 * Narrows an `unknown` value to a `boolean` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureBoolean(value: unknown, message?: string): boolean {
  return ensure(asBoolean(value), message || 'Value is not an boolean');
}

/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureObject(value: unknown, message?: string): object {
  return ensure(asObject(value), message || 'Value is not an object');
}

/**
 * Narrows an `unknown` value to an `object` if it is type-compatible and tests positively with {@link isPlainObject},
 * or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensurePlainObject(value: unknown, message?: string): object {
  return ensure(asObject(value), message || 'Value is not an object');
}

/**
 * Narrows an `unknown` value to instance of constructor type `T` if it is type-compatible, or raises an error
 * otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureInstance<C extends AnyConstructor>(value: unknown, ctor: C, message?: string): InstanceType<C> {
  return ensure(asInstance(value, ctor), message || `Value is not an instance of ${ctor.name}`);
}

/**
 * Narrows an `unknown` value to an `Array` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureArray(value: unknown, message?: string): AnyArray {
  return ensure(asArray(value), message || 'Value is not an array');
}

/**
 * Narrows an `unknown` value to an `AnyFunction` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureFunction(value: unknown, message?: string): AnyFunction {
  return ensure(asFunction(value), message || 'Value is not a function');
}

/**
 * Narrows an `unknown` value to an `AnyJson` if it is type-compatible, or returns `undefined` otherwise.
 *
 * See also caveats noted in {@link isAnyJson}.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was not a JSON value type.
 */
export function ensureAnyJson(value: unknown, message?: string): AnyJson {
  if (!isAnyJson(value)) {
    throw new UnexpectedValueTypeError(message || 'Value is not a JSON-compatible value type');
  }
  return toAnyJson(value);
}

/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureJsonMap(value: Optional<AnyJson>, message?: string): JsonMap {
  return ensure(asJsonMap(value), message || 'Value is not a JsonMap');
}

/**
 * Narrows an `AnyJson` value to a `JsonArray` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureJsonArray(value: Optional<AnyJson>, message?: string): JsonArray {
  return ensure(asJsonArray(value), message || 'Value is not JsonArray');
}
