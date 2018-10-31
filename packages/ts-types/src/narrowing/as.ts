/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  AnyArray,
  AnyConstructor,
  AnyFunction,
  AnyJson,
  JsonArray,
  JsonMap,
  Optional
} from '../types';
import {
  isArray,
  isBoolean,
  isFunction,
  isInstance,
  isJsonArray,
  isJsonMap,
  isNumber,
  isObject,
  isPlainObject,
  isString
} from './is';

/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asString(value: unknown): Optional<string>;
/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asString(value: unknown, defaultValue: string): string;
// underlying function
export function asString(
  value: unknown,
  defaultValue?: string
): Optional<string> {
  return isString(value) ? value : defaultValue;
}

/**
 * Narrows an `unknown` value to a `number` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asNumber(value: unknown): Optional<number>;
/**
 * Narrows an `unknown` value to a `number` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asNumber(value: unknown, defaultValue: number): number;
// underlying function
export function asNumber(
  value: unknown,
  defaultValue?: number
): Optional<number> {
  return isNumber(value) ? value : defaultValue;
}

/**
 * Narrows an `unknown` value to a `boolean` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asBoolean(value: unknown): Optional<boolean>;
/**
 * Narrows an `unknown` value to a `boolean` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asBoolean(value: unknown, defaultValue: boolean): boolean;
// underlying function
export function asBoolean(
  value: unknown,
  defaultValue?: boolean
): Optional<boolean> {
  return isBoolean(value) ? value : defaultValue;
}

/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asObject(value: unknown): Optional<object>;
/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asObject(value: unknown, defaultValue: object): object;
// underlying function
export function asObject(
  value: unknown,
  defaultValue?: object
): Optional<object> {
  return isObject(value) ? value : defaultValue;
}

/**
 * Narrows an `unknown` value to a plain `object` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asPlainObject(value: unknown): Optional<object>;
/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asPlainObject(value: unknown, defaultValue: object): object;
// underlying function
export function asPlainObject(
  value: unknown,
  defaultValue?: object
): Optional<object> {
  return isPlainObject(value) ? value : defaultValue;
}

/**
 * Narrows an `unknown` value to an instance of constructor type `T` if it is type-compatible, or returns `undefined`
 * otherwise.
 *
 * @param value The value to test.
 */
export function asInstance<C extends AnyConstructor>(
  value: unknown,
  ctor: C
): Optional<InstanceType<C>>;
/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asInstance<C extends AnyConstructor>(
  value: unknown,
  ctor: C,
  defaultValue: InstanceType<C>
): InstanceType<C>;
// underlying function
export function asInstance<C extends AnyConstructor>(
  value: unknown,
  ctor: C,
  defaultValue?: InstanceType<C>
): Optional<InstanceType<C>> {
  return isInstance(value, ctor) ? value : defaultValue;
}

/**
 * Narrows an `unknown` value to an `Array` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asArray(value: unknown): Optional<AnyArray>;
/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asArray(value: unknown, defaultValue: AnyArray): AnyArray;
// underlying function
export function asArray(
  value: unknown,
  defaultValue?: AnyArray
): Optional<AnyArray> {
  return isArray(value) ? value : defaultValue;
}

/**
 * Narrows an `unknown` value to an `AnyFunction` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asFunction(value: unknown): Optional<AnyFunction>;
/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asFunction(
  value: unknown,
  defaultValue: AnyFunction
): AnyFunction;
// underlying function
export function asFunction(
  value: unknown,
  defaultValue?: AnyFunction
): Optional<AnyFunction> {
  return isFunction(value) ? value : defaultValue;
}

/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asJsonMap(value: Optional<AnyJson>): Optional<JsonMap>;
/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asJsonMap(
  value: Optional<AnyJson>,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function asJsonMap(
  value: Optional<AnyJson>,
  defaultValue?: JsonMap
): Optional<JsonMap> {
  return isJsonMap(value) ? value : defaultValue;
}

/**
 * Narrows an `AnyJson` value to a `JsonArray` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asJsonArray(value: Optional<AnyJson>): Optional<JsonArray>;
/**
 * Narrows an `AnyJson` value to a `JsonArray` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if the value was undefined or of the incorrect type.
 */
export function asJsonArray(
  value: Optional<AnyJson>,
  defaultValue: JsonArray
): JsonArray;
// underlying function
export function asJsonArray(
  value: Optional<AnyJson>,
  defaultValue?: JsonArray
): Optional<JsonArray> {
  return isJsonArray(value) ? value : defaultValue;
}
