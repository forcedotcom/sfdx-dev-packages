/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @module narrowing
 */

import { JsonCloneError, UnexpectedValueTypeError } from './errors';
import {
  AnyFunction,
  AnyJson,
  JsonArray,
  JsonMap,
  KeyOf,
  Many,
  Nullable,
  Optional
} from './types';

/**
 * Tests whether an `unknown` value is a `string`.
 *
 * @param value Any value to test.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Tests whether an `unknown` value is a `number`.
 *
 * @param value Any value to test.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Tests whether an `unknown` value is a `boolean`.
 *
 * @param value Any value to test.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Tests whether an `unknown` value is an `object` subtype.
 *
 * @param value Any value to test.
 */
export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

/**
 * Tests whether or not an `unknown` value is a plain JS object.
 *
 * @param value Any value to test.
 */
export function isPlainObject(value: unknown): value is object {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Tests whether an `unknown` value is an `Array`.
 *
 * @param value Any value to test.
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Tests whether an `unknown` value is a `function`.
 *
 * @param value Any value to test.
 */
export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function';
}

/**
 * Tests whether or not a `key` string is a key of the given object type `T`.
 *
 * @param key The string to test as a key of the target object.
 * @param obj The target object to check the key in.
 */
export function isKeyOf<T extends object, K extends KeyOf<T>>(
  key: string,
  obj: T
): key is K {
  return Object.keys(obj).includes(key);
}

/**
 * Tests whether `unknown` value is a valid JSON type. Note that objects and arrays are only checked using a shallow
 * test. To be sure that a given value is JSON-compatible at runtime, see {@link toAnyJson}.
 *
 * @param value The value to test.
 */
export function isAnyJson(value: Optional<unknown>): value is AnyJson {
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
 * @param value An `AnyJson` value to test.
 */
export function isJsonMap(value: Optional<AnyJson>): value is JsonMap {
  return isPlainObject(value);
}

/**
 * Tests whether an `AnyJson` value is an array.
 *
 * @param value An `AnyJson` value to test.
 */
export function isJsonArray(value: Optional<AnyJson>): value is JsonArray {
  return isArray(value);
}

/**
 * Narrows an `AnyJson` value to a `string` if it is type-compatible, or returns undefined otherwise.
 *
 * @param value An `AnyJson` value to test.
 */
export function asString(value: Optional<AnyJson>): Optional<string>;
/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asString(
  value: Optional<AnyJson>,
  defaultValue: string
): string;
// underlying function
export function asString(
  value: Optional<AnyJson>,
  defaultValue?: string
): Optional<string> {
  return isString(value) ? value : defaultValue;
}

/**
 * Narrows an `AnyJson` value to a `number` if it is type-compatible, or returns undefined otherwise.
 *
 * @param value An `AnyJson` value to test.
 */
export function asNumber(value: Optional<AnyJson>): Optional<number>;
/**
 * Narrows an `unknown` value to a `number` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asNumber(
  value: Optional<AnyJson>,
  defaultValue: number
): number;
// underlying function
export function asNumber(
  value: Optional<AnyJson>,
  defaultValue?: number
): Optional<number> {
  return isNumber(value) ? value : defaultValue;
}

/**
 * Narrows an `AnyJson` value to a `boolean` if it is type-compatible, or returns undefined otherwise.
 *
 * @param value An `AnyJson` value to test.
 */
export function asBoolean(value: Optional<AnyJson>): Optional<boolean>;
/**
 * Narrows an `unknown` value to a `boolean` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asBoolean(
  value: Optional<AnyJson>,
  defaultValue: boolean
): boolean;
// underlying function
export function asBoolean(
  value: Optional<AnyJson>,
  defaultValue?: boolean
): Optional<boolean> {
  return isBoolean(value) ? value : defaultValue;
}

/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or returns undefined otherwise.
 *
 * @param value An `AnyJson` value to test.
 */
export function asJsonMap(value: Optional<AnyJson>): Optional<JsonMap>;
/**
 * Narrows an `unknown` value to a `JsonMap` if it is type-compatible, or returns the provided default otherwise.
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
 * Narrows an `AnyJson` value to a `JsonArray` if it is type-compatible, or returns undefined otherwise.
 *
 * @param value An `AnyJson` value to test.
 */
export function asJsonArray(value: Optional<AnyJson>): Optional<JsonArray>;
/**
 * Narrows an `unknown` value to a `JsonArray` if it is type-compatible, or returns the provided default otherwise.
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

/**
 * Narrows an `unknown` value to an `AnyJson` if it is type-compatible\&ast;, or returns `undefined` otherwise.
 *
 * _&ast; This is not a 100% safe operation -- it will not deeply validate plain object or array structures
 * to ensure that they contain only `AnyJson` values. When type-narrowing potential objects or arrays with this
 * function, it's the responsibility of the caller to understand the risks of making such a shallow type assertion
 * over the `value` data._
 *
 * @param value The value to test.
 */
export function coerceAnyJson(value: unknown): Optional<AnyJson>;

/**
 * Narrows an `unknown` value to an `AnyJson` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function coerceAnyJson(value: unknown, defaultValue: AnyJson): AnyJson;
// underlying function
export function coerceAnyJson(
  value: unknown,
  defaultValue?: AnyJson
): Optional<AnyJson> {
  return isAnyJson(value) ? value : defaultValue;
}

/**
 * Narrows an object of type `T` to a `JsonMap` using a shallow type-compatibility check. Use this when the source of
 * the object is known to be JSON-compatible and you want simple type coercion to a `JsonMap`. Use {@link toJsonMap}
 * instead when the `value` object _cannot_ be guaranteed to be JSON-compatible and you want an assurance of runtime
 * type safety. This is a shortcut for writing `asJsonMap(coerceAnyJson(value))`.
 *
 * @param value The object to coerce.
 */
export function coerceJsonMap<T extends object>(
  value: Optional<T>
): Optional<JsonMap>;
/**
 * Narrows an object of type `T` to a `JsonMap` using a shallow type-compatibility check. Use this when the source of
 * the object is known to be JSON-compatible and you want simple type coercion to a `JsonMap`. Use {@link toJsonMap}
 * instead when the `value` object _cannot_ be guaranteed to be JSON-compatible and you want an assurance of runtime
 * type safety.
 *
 * @param value The object to coerce.
 * @param defaultValue The default to return if `value` was `undefined`.
 */
export function coerceJsonMap<T extends object>(
  value: Optional<T>,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function coerceJsonMap<T extends object>(
  value: Optional<T>,
  defaultValue?: JsonMap
): Optional<JsonMap> {
  return asJsonMap(coerceAnyJson(value)) || defaultValue;
}

/**
 * Narrows an array of type `T` to a `JsonArray` using a shallow type-compatibility check. Use this when the source of
 * the array is known to be JSON-compatible and you want simple type coercion to a `JsonArray`. Use {@link toJsonArray}
 * instead when the `value` array _cannot_ be guaranteed to be JSON-compatible and you want an assurance of runtime
 * type safety. This is a shortcut for writing `asJsonArray(coerceAnyJson(value))`.
 *
 * @param value The array to coerce.
 */
export function coerceJsonArray<T>(value: Optional<T[]>): Optional<JsonArray>;
/**
 * Narrows an array of type `T` to a `JsonArray` using a shallow type-compatibility check. Use this when the source of
 * the array is known to be JSON-compatible and you want simple type coercion to a `JsonArray`. Use {@link toJsonArray}
 * instead when the `value` array _cannot_ be guaranteed to be JSON-compatible and you want an assurance of runtime
 * type safety.
 *
 * @param value The array to coerce.
 * @param defaultValue The default to return if `value` was `undefined`.
 */
export function coerceJsonArray<T>(
  value: Optional<T[]>,
  defaultValue: JsonArray
): JsonArray;
// underlying method
export function coerceJsonArray<T>(
  value: Optional<T[]>,
  defaultValue?: JsonArray
): Optional<JsonArray> {
  return asJsonArray(coerceAnyJson(value)) || defaultValue;
}

/**
 * Narrows an object of type `T` to an `AnyJson` following a deep, brute-force conversion of the object's data to
 * only consist of JSON-compatible values by performing a basic JSON clone on the object. This is preferable to
 * using the weaker `coerceAnyJson(unknown)` to type-narrow an arbitrary value to an `AnyJson` when the value's source
 * is unknown, but it comes with the increased overhead of performing the deep JSON clone to ensure runtime type
 * safety. The use of JSON cloning guarantees type safety by omitting non-JSON-compatible elements from the resulting
 * JSON data structure. Use `coerceAnyJson(unknown)` when the `value` object can be guaranteed to be JSON-compatible
 * and only needs type narrowing.
 *
 * @param value The value to convert.
 * @throws {@link JsonCloneError} If the value values contain circular references.
 */
export function toAnyJson<T>(value: Optional<T>): Optional<AnyJson>;
/**
 * Narrows an object of type `T` to an `AnyJson` following a deep, brute-force conversion of the object's data to
 * only consist of JSON-compatible values by performing a basic JSON clone on the object. This is preferable to
 * using the weaker `coerceAnyJson(unknown)` to type-narrow an arbitrary value to an `AnyJson` when the value's source
 * is unknown, but it comes with the increased overhead of performing the deep JSON clone to ensure runtime type
 * safety. The use of JSON cloning guarantees type safety by omitting non-JSON-compatible elements from the resulting
 * JSON data structure. Use `coerceAnyJson(unknown)` when the `value` object can be guaranteed to be JSON-compatible
 * and only needs type narrowing.
 *
 * @param value The value to convert.
 * @param defaultValue The default to return if `value` was `undefined`.
 * @throws {@link JsonCloneError} If the value values contain circular references.
 */
export function toAnyJson<T>(
  value: Optional<T>,
  defaultValue: AnyJson
): AnyJson;
// underlying function
export function toAnyJson<T>(
  value: Optional<T>,
  defaultValue?: AnyJson
): Optional<AnyJson> {
  try {
    return value !== undefined
      ? JSON.parse(JSON.stringify(value))
      : defaultValue;
  } catch (err) {
    throw new JsonCloneError(err);
  }
}

/**
 * Narrows an object of type `T` to a `JsonMap` following a deep, brute-force conversion of the object's data to
 * only consist of JSON-compatible values by performing a basic JSON clone on the object. This is preferable to
 * using the weaker `coerceJsonMap(object)` to type-narrow an arbitrary object to a `JsonMap` when the object's source
 * is unknown, but it comes with the increased overhead of performing the deep JSON clone to ensure runtime type
 * safety. The use of JSON cloning guarantees type safety by omitting non-JSON-compatible elements from the resulting
 * JSON data structure. Use `coerceJsonMap(object)` when the `value` object can be guaranteed to be JSON-compatible
 * and only needs type narrowing.
 *
 * @param value The object to convert.
 * @throws {@link JsonCloneError} If the object values contain circular references.
 */
export function toJsonMap<T extends object>(
  value: Optional<T>
): Optional<JsonMap>;
/**
 * Narrows an object of type `T` to a `JsonMap` following a deep, brute-force conversion of the object's data to
 * only consist of JSON-compatible values by performing a basic JSON clone on the object. This is preferable to
 * using the weaker `coerceJsonMap(object)` to type-narrow an arbitrary object to a `JsonMap` when the object's source
 * is unknown, but it comes with the increased overhead of performing the deep JSON clone to ensure runtime type
 * safety. The use of JSON cloning guarantees type safety by omitting non-JSON-compatible elements from the resulting
 * JSON data structure. Use `coerceJsonMap(object)` when the `value` object can be guaranteed to be JSON-compatible
 * and only needs type narrowing.
 *
 * @param value The object to convert.
 * @param defaultValue The default to return if `value` was `undefined`.
 * @throws {@link JsonCloneError} If the object values contain circular references.
 */
export function toJsonMap<T extends object>(
  value: Optional<T>,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function toJsonMap<T extends object>(
  value: Optional<T>,
  defaultValue?: JsonMap
): Optional<JsonMap> {
  return asJsonMap(toAnyJson(value)) || defaultValue;
}

/**
 * Narrows an array of type `T` to a `JsonArray` following a deep, brute-force conversion of the array's data to
 * only consist of JSON-compatible values by performing a basic JSON clone on the array. This is preferable to
 * using the weaker `coerceJsonArray(array)` to type-narrow an arbitrary array to a `JsonArray` when the array's source
 * is unknown, but it comes with the increased overhead of performing the deep JSON clone to ensure runtime type
 * safety. The use of JSON cloning guarantees type safety by omitting non-JSON-compatible elements from the resulting
 * JSON data structure. Non-JSON entries will be converted to `null`s. Use `coerceJsonArray(array)` when the `value`
 * object can be guaranteed to be JSON-compatible and only needs type narrowing.
 *
 * @param value The array to convert.
 * @throws {@link JsonCloneError} If the array values contain circular references.
 */
export function toJsonArray<T>(value: Optional<T[]>): Optional<JsonArray>;
/**
 * Narrows an object of type `T` to a `JsonMap` following a deep, brute-force conversion of the object's data to
 * only consist of JSON-compatible values by performing a basic JSON clone on the object. This is preferable to
 * using the weaker `coerceJsonMap(object)` to type-narrow an arbitrary array to a `JsonMap` when the object's source
 * is unknown, but it comes with the increased overhead of performing the deep JSON clone to ensure runtime type
 * safety. The use of JSON cloning guarantees type safety by omitting non-JSON-compatible elements from the resulting
 * JSON data structure. Non-JSON entries will be converted to `null`s. Use `coerceJsonArray(array)` when the `value`
 * object can be guaranteed to be JSON-compatible and only needs type narrowing.
 *
 * @param value The array to convert.
 * @param defaultValue The default to return if the value was undefined or of the incorrect type.
 * @throws {@link JsonCloneError} If the array values contain circular references.
 */
export function toJsonArray<T>(
  value: Optional<T[]>,
  defaultValue: JsonArray
): JsonArray;
// underlying method
export function toJsonArray<T>(
  value: Optional<T[]>,
  defaultValue?: JsonArray
): Optional<JsonArray> {
  return asJsonArray(toAnyJson(value)) || defaultValue;
}

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
 * Narrows an `unknown` value to an `AnyJson` if it is type-compatible, or returns undefined otherwise.
 *
 * See also caveats noted in {@link isAnyJson}.
 *
 * @param value An `AnyJson` value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was not a JSON value type.
 */
export function ensureAnyJson(value: unknown, message?: string): AnyJson {
  if (!isAnyJson(value)) {
    throw new UnexpectedValueTypeError(
      message || 'Value is not a JSON value type'
    );
  }
  return toAnyJson(value);
}

/**
 * Narrows an `AnyJson` value to a `string` if it is type-compatible, or raises an error otherwise.
 *
 * @param value An `AnyJson` value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureString(
  value: Optional<AnyJson>,
  message?: string
): string {
  if (!isString(value)) {
    throw new UnexpectedValueTypeError(message || 'Value is not a string');
  }
  return value;
}

/**
 * Narrows an `AnyJson` value to a `number` if it is type-compatible, or raises an error otherwise.
 *
 * @param value An `AnyJson` value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureNumber(
  value: Optional<AnyJson>,
  message?: string
): number {
  if (!isNumber(value)) {
    throw new UnexpectedValueTypeError(message || 'Value is not a number');
  }
  return value;
}

/**
 * Narrows an `AnyJson` value to a `boolean` if it is type-compatible, or raises an error otherwise.
 *
 * @param value An `AnyJson` value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureBoolean(
  value: Optional<AnyJson>,
  message?: string
): boolean {
  if (!isBoolean(value)) {
    throw new UnexpectedValueTypeError(message || 'Value is not a boolean');
  }
  return value;
}

/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or raises an error otherwise.
 *
 * @param value An `AnyJson` value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureJsonMap(
  value: Optional<AnyJson>,
  message?: string
): JsonMap {
  if (!isJsonMap(value)) {
    throw new UnexpectedValueTypeError(message || 'Value is not a JsonMap');
  }
  return value;
}

/**
 * Narrows an `AnyJson` value to a `JsonArray` if it is type-compatible, or raises an error otherwise.
 *
 * @param value An `AnyJson` value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureJsonArray(
  value: Optional<AnyJson>,
  message?: string
): JsonArray {
  if (!isJsonArray(value)) {
    throw new UnexpectedValueTypeError(message || 'Value is not a JsonArray');
  }
  return value;
}

/**
 * Gets `AnyJson` element of a `JsonMap` given a query path.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 */
export function getAsAnyJson(
  json: Optional<JsonMap>,
  path: Many<string>
): Optional<AnyJson>;
/**
 * Gets an `AnyJson` element of a `JsonMap` given a query path, returning a default if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param defaultValue A fallback value.
 */
export function getAsAnyJson(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue: AnyJson
): AnyJson;
// underlying function
export function getAsAnyJson(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue?: AnyJson
): Optional<AnyJson> {
  if (typeof path === 'string') {
    path = path.split('.');
  }
  let index = 0;
  let node: Optional<AnyJson> = json;
  while (isJsonMap(node) && index < path.length) {
    node = node[path[index++]];
  }
  return (index && index === path.length ? node : undefined) || defaultValue;
}

/**
 * Gets a `string` element of a `JsonMap` given a query path.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 */
export function getAsString(
  json: Optional<JsonMap>,
  path: Many<string>
): Optional<string>;
/**
 * Gets a `string` element of a `JsonMap` given a query path, returning a default if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param defaultValue A fallback value.
 */
export function getAsString(
  json: JsonMap,
  path: Many<string>,
  defaultValue: string
): string;
// underlying function
export function getAsString(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue?: string
): Optional<string> {
  if (defaultValue) return ensureString(getAsAnyJson(json, path, defaultValue));
  return asString(getAsAnyJson(json, path));
}

/**
 * Gets a `number` element of a `JsonMap` given a query path.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 */
export function getAsNumber(
  json: Optional<JsonMap>,
  path: Many<string>
): Optional<number>;
/**
 * Gets a `number` element of a `JsonMap` given a query path, returning a default if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param defaultValue A fallback value.
 */
export function getAsNumber(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue: number
): number;
// underlying function
export function getAsNumber(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue?: number
): Optional<number> {
  if (defaultValue) return ensureNumber(getAsAnyJson(json, path, defaultValue));
  return asNumber(getAsAnyJson(json, path));
}

/**
 * Gets a `boolean` element of a `JsonMap` given a query path.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 */
export function getAsBoolean(
  json: Optional<JsonMap>,
  path: Many<string>
): Optional<boolean>;
/**
 * Gets a `boolean` element of a `JsonMap` given a query path, returning a default if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param defaultValue A fallback value.
 */
export function getAsBoolean(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue: boolean
): boolean;
// underlying function
export function getAsBoolean(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue?: boolean
): Optional<boolean> {
  if (defaultValue) {
    return ensureBoolean(getAsAnyJson(json, path, defaultValue));
  }
  return asBoolean(getAsAnyJson(json, path));
}

/**
 * Gets a `JsonMap` element of a `JsonMap` given a query path.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 */
export function getAsJsonMap(
  json: Optional<JsonMap>,
  path: Many<string>
): Optional<JsonMap>;
/**
 * Gets a `JsonMap` element of a `JsonMap` given a query path, returning a default if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param defaultValue A fallback value.
 */
export function getAsJsonMap(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function getAsJsonMap(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue?: JsonMap
): Optional<JsonMap> {
  if (defaultValue) {
    return ensureJsonMap(getAsAnyJson(json, path, defaultValue));
  }
  return asJsonMap(getAsAnyJson(json, path));
}

/**
 * Gets a `JsonArray` element of a `JsonMap` given a query path.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 */
export function getAsJsonArray(
  json: Optional<JsonMap>,
  path: Many<string>
): Optional<JsonArray>;
/**
 * Gets a `JsonArray` element of a `JsonMap` given a query path, returning a default if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param defaultValue A fallback value.
 */
export function getAsJsonArray(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue: JsonArray
): JsonArray;
// underlying function
export function getAsJsonArray(
  json: Optional<JsonMap>,
  path: Many<string>,
  defaultValue?: JsonArray
): Optional<JsonArray> {
  if (defaultValue) {
    return ensureJsonArray(getAsAnyJson(json, path, defaultValue));
  }
  return asJsonArray(getAsAnyJson(json, path));
}

/**
 * Gets an `AnyJson` element of a `JsonMap` given a query path, or raises an error if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined or not type-compatible.
 */
export function getEnsureAnyJson(
  json: Optional<JsonMap>,
  path: Many<string>,
  message?: string
): AnyJson {
  return ensureAnyJson(getAsAnyJson(json, path), message);
}

/**
 * Gets a `string` element of a `JsonMap` given a query path, or raises an error if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined or not type-compatible.
 */
export function getEnsureString(
  json: Optional<JsonMap>,
  path: Many<string>,
  message?: string
): string {
  return ensureString(getAsAnyJson(json, path), message);
}

/**
 * Gets a `number` element of a `JsonMap` given a query path, or raises an error if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined or not type-compatible.
 */
export function getEnsureNumber(
  json: Optional<JsonMap>,
  path: Many<string>,
  message?: string
): number {
  return ensureNumber(getAsAnyJson(json, path, message));
}

/**
 * Gets a `boolean` element of a `JsonMap` given a query path, or raises an error if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined or not type-compatible.
 */
export function getEnsureBoolean(
  json: Optional<JsonMap>,
  path: Many<string>,
  message?: string
): boolean {
  return ensureBoolean(getAsAnyJson(json, path), message);
}

/**
 * Gets a `JsonMap` element of a `JsonMap` given a query path, or raises an error if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined or not type-compatible.
 */

export function getEnsureJsonMap(
  json: Optional<JsonMap>,
  path: Many<string>,
  message?: string
): JsonMap {
  return ensureJsonMap(getAsAnyJson(json, path), message);
}

/**
 * Gets a `JsonArray` element of a `JsonMap` given a query path, or raises an error if not found or not type-compatible.
 *
 * @param json The `JsonMap` to query.
 * @param path The query path.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined or not type-compatible.
 */
export function getEnsureJsonArray(
  json: Optional<JsonMap>,
  path: Many<string>,
  message?: string
): JsonArray {
  return ensureJsonArray(getAsAnyJson(json, path), message);
}

/**
 * Returns the keys of an object of type `T`. This is like `Object.keys` except the return type
 * captures the known keys of `T`.
 *
 * Note that it is the responsibility of the caller to use this wisely -- there are cases where
 * the runtime set of keys returned may be broader than the type checked set at compile time,
 * so there's potential for this to be abused in ways that are not inherently type safe. For
 * example, given base class `Animal`, subclass `Fish`, and `const animal: Animal = new Fish();`
 * then `keysOf(animal)` will not type-check the entire set of keys of the object `animal` since
 * it is actually an instance of type `Fish`, which has an extended property set.
 *
 * In general, it should be both convenient and type-safe to use this when enumerating the keys
 * of simple data objects with known properties.
 *
 * ```
 * interface Point { x: number; y: number; }
 * const point: Point = { x: 1, y: 2 };
 * const keys = keysOf(point);
 * // type of keys -> ('a' | 'b')[]
 * for (const key of keys) {
 *   console.log(key, point[key]);
 * }
 * // x 1
 * // y 2
 * ```
 *
 * @param obj The object of interest.
 */
export function keysOf<T extends object, K extends KeyOf<T>>(obj: T): K[] {
  return Object.keys(obj) as K[];
}

/**
 * Returns the entries of an object of type `T`. This is like `Object.entries` except the return type
 * captures the known keys and value types of `T`.
 *
 * Note that it is the responsibility of the caller to use this wisely -- there are cases where
 * the runtime set of entries returned may be broader than the type checked set at compile time,
 * so there's potential for this to be abused in ways that are not inherently type safe. For
 * example, given base class `Animal`, subclass `Fish`, and `const animal: Animal = new Fish();`
 * then `entriesOf(animal)` will not type-check the entire set of keys of the object `animal` since
 * it is actually an instance of type `Fish`, which has an extended property set.
 *
 * In general, it should be both convenient and type-safe to use this when enumerating the entries
 * of simple data objects with known properties.
 *
 * ```
 * interface Point { x: number; y: number; }
 * const point: Point = { x: 1, y: 2 };
 * // type of entries -> ['x' | 'y', number][]
 * const entries = entriesOf(point);
 * for (const entry of entries) {
 *   console.log(entry[0], entry[1]);
 * }
 * // x 1
 * // y 2
 * ```
 *
 * @param obj The object of interest.
 */
export function entriesOf<T extends object, K extends KeyOf<T>>(
  obj: T
): Array<[K, T[K]]> {
  return Object.entries(obj) as Array<[K, T[K]]>;
}

/**
 * Returns the values of an object of type `T`. This is like `Object.values` except the return type
 * captures the possible value types of `T`.
 *
 * Note that it is the responsibility of the caller to use this wisely -- there are cases where
 * the runtime set of values returned may be broader than the type checked set at compile time,
 * so there's potential for this to be abused in ways that are not inherently type safe. For
 * example, given base class `Animal`, subclass `Fish`, and `const animal: Animal = new Fish();`
 * then `valuesOf(animal)` will not type-check the entire set of values of the object `animal` since
 * it is actually an instance of type `Fish`, which has an extended property set.
 *
 * In general, it should be both convenient and type-safe to use this when enumerating the values
 * of simple data objects with known properties.
 *
 * ```
 * interface Point { x: number; y: number; }
 * const point: Point = { x: 1, y: 2 };
 * const values = valuesOf(point);
 * // type of values -> number[]
 * for (const value of values) {
 *   console.log(value);
 * }
 * // 1
 * // 2
 * ```
 *
 * @param obj The object of interest.
 */
export function valuesOf<T extends object, K extends KeyOf<T>>(
  obj: T
): Array<T[K]> {
  return Object.values(obj) as Array<T[K]>;
}

/**
 * Returns an array of all `string` keys in an object of type `T` whose values are neither `null` nor `undefined`.
 * This can be convenient for enumerating the keys of definitely assigned properties in an object or `Dictionary`.
 *
 * See also caveats outlined in {@link keysOf}.
 *
 * @param obj The object of interest.
 */
export function definiteKeysOf<T extends object>(obj: T): Array<KeyOf<T>> {
  return definiteEntriesOf(obj).map(entry => entry[0]);
}

/**
 * Returns an array of all entry tuples of type `[K, NonNullable<T[K]>]` in an object `T` whose values are neither
 * `null` nor `undefined`. This can be convenient for enumerating the entries of unknown object with optional properties
 * (including `Dictionary`s) without worrying about performing checks against possibly `undefined` or `null` values.
 *
 * See also caveats outlined in {@link entriesOf}.
 *
 * @param obj The object of interest.
 */
export function definiteEntriesOf<
  T extends object,
  K extends KeyOf<T>,
  V extends NonNullable<T[K]>
>(obj: T): Array<[K, V]> {
  return entriesOf(obj).filter((entry): entry is [K, V] => entry[1] != null);
}

/**
 * Returns an array of all values of type `T` in a `Dictionary<T>` for values that are neither `null` nor `undefined`.
 * This can be convenient for enumerating all non-nullable values of unknown `Dictionary`.
 *
 * @param obj The object of interest.
 */
export function definiteValuesOf<T extends object>(
  obj: T
): Array<NonNullable<T[KeyOf<T>]>> {
  return definiteEntriesOf(obj).map(entry => entry[1]);
}
