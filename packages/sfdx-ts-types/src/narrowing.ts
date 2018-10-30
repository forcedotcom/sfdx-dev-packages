/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { JsonCloneError, UnexpectedValueTypeError } from './errors';
import {
  AnyArray,
  AnyArrayLike,
  AnyConstructor,
  AnyFunction,
  AnyJson,
  JsonArray,
  JsonCollection,
  JsonMap,
  KeyOf,
  Many,
  Nullable,
  Optional,
  View
} from './types';

/**
 * Returns the given `value` if not either `undefined` or `null`, or the given `defaultValue` otherwise if defined.
 * Returns `null` if the value is `null` and `defaultValue` is `undefined`.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was not defined.
 */
export function valueOrDefault<T>(
  value: Nullable<T>,
  defaultValue: Nullable<T>
): Nullable<T> {
  return value != null || defaultValue === undefined ? value : defaultValue;
}

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
  return Object.prototype.toString.call(value) === '[object Object]';
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
  return isString(value) || hasNumber(value, 'length');
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
  value: Nullable<T>
): Optional<JsonMap>;
/**
 * Narrows an object of type `T` to a `JsonMap` using a shallow type-compatibility check. Use this when the source of
 * the object is known to be JSON-compatible and you want simple type coercion to a `JsonMap`. Use {@link toJsonMap}
 * instead when the `value` object _cannot_ be guaranteed to be JSON-compatible and you want an assurance of runtime
 * type safety. This is a shortcut for writing `asJsonMap(coerceAnyJson(value)) || defaultValue`.
 *
 * @param value The object to coerce.
 * @param defaultValue The default to return if `value` was not defined.
 */
export function coerceJsonMap<T extends object>(
  value: Nullable<T>,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function coerceJsonMap<T extends object>(
  value: Nullable<T>,
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
export function coerceJsonArray<T>(value: Nullable<T[]>): Optional<JsonArray>;
/**
 * Narrows an array of type `T` to a `JsonArray` using a shallow type-compatibility check. Use this when the source of
 * the array is known to be JSON-compatible and you want simple type coercion to a `JsonArray`. Use {@link toJsonArray}
 * instead when the `value` array _cannot_ be guaranteed to be JSON-compatible and you want an assurance of runtime
 * type safety. This is a shortcut for writing `asJsonArray(coerceAnyJson(value)) || defaultValue`.
 *
 * @param value The array to coerce.
 * @param defaultValue The default to return if `value` was not defined.
 */
export function coerceJsonArray<T>(
  value: Nullable<T[]>,
  defaultValue: JsonArray
): JsonArray;
// underlying method
export function coerceJsonArray<T>(
  value: Nullable<T[]>,
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
export function toAnyJson<T>(value: Nullable<T>): Optional<AnyJson>;
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
 * @param defaultValue The default to return if `value` was not defined.
 * @throws {@link JsonCloneError} If the value values contain circular references.
 */
export function toAnyJson<T>(
  value: Nullable<T>,
  defaultValue: AnyJson
): AnyJson;
// underlying function
export function toAnyJson<T>(
  value: Nullable<T>,
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
  value: Nullable<T>
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
 * @param defaultValue The default to return if `value` was not defined.
 * @throws {@link JsonCloneError} If the object values contain circular references.
 */
export function toJsonMap<T extends object>(
  value: Nullable<T>,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function toJsonMap<T extends object>(
  value: Nullable<T>,
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
    throw new UnexpectedValueTypeError(
      message || 'Value is not a JSON-compatible value type'
    );
  }
  return toAnyJson(value);
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
 * Narrows an `unknown` value to instance of constructor type `T` if it is type-compatible, or raises an error
 * otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureInstance<C extends AnyConstructor>(
  value: unknown,
  ctor: C,
  message?: string
): InstanceType<C> {
  return ensure(
    asInstance(value, ctor),
    message || `Value is not an instance of ${ctor.name}`
  );
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
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureJsonMap(
  value: Optional<AnyJson>,
  message?: string
): JsonMap {
  return ensure(asJsonMap(value), message || 'Value is not a JsonMap');
}

/**
 * Narrows an `AnyJson` value to a `JsonArray` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureJsonArray(
  value: Optional<AnyJson>,
  message?: string
): JsonArray {
  return ensure(asJsonArray(value), message || 'Value is not JsonArray');
}

/**
 * Tests whether a value of type `T` contains one or more property `keys`. If so, the type of the tested value is
 * narrowed to reflect the existence of those keys for convenient access in the same scope. Returns false if the
 * property key does not exist on the target type, which must be an object. Returns true if the property key exists,
 * even if the associated value is `undefined` or `null`.
 *
 * ```
 * // type of obj -> unknown
 * if (has(obj, 'name')) {
 *   // type of obj -> { name: unknown }
 *   if (has(obj, 'data')) {
 *     // type of obj -> { name: unknown } & { data: unknown }
 *   } else if (has(obj, ['error', 'status'])) {
 *     // type of obj -> { name: unknown } & { error: unknown, status: unknown }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys One or more `string` keys to check for existence.
 */
export function has<T, K extends string>(
  value: T,
  keys: Many<K>
): value is T & View<K> {
  return (
    isObject(value) &&
    (isArray(keys) ? keys.every(k => k in value) : keys in value)
  );
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `string`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `string`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasString(obj, 'name')) {
 *   // type of obj -> { name: string }
 *   if (hasString(obj, 'message')) {
 *     // type of obj -> { name: string } & { message: string }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys A `string` key to check for existence.
 */
export function hasString<T, K extends string>(
  value: T,
  key: K
): value is T & View<K, string> {
  return has(value, key) && isString(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `number`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `number`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasNumber(obj, 'offset')) {
 *   // type of obj -> { offset: number }
 *   if (hasNumber(obj, 'page') && hasArray(obj, 'items')) {
 *     // type of obj -> { offset: number } & { page: number } & { items: Array<unknown> }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys A `number` key to check for existence.
 */
export function hasNumber<T, K extends string>(
  value: T,
  key: K
): value is T & View<K, number> {
  return has(value, key) && isNumber(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `boolean`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `boolean`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasBoolean(obj, 'enabled')) {
 *   // type of obj -> { enabled: boolean }
 *   if (hasBoolean(obj, 'hidden')) {
 *     // type of obj -> { enabled: boolean } & { hidden: boolean }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys A `boolean` key to check for existence.
 */
export function hasBoolean<T, K extends string>(
  value: T,
  key: K
): value is T & View<K, boolean> {
  return has(value, key) && isBoolean(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `object`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `object`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasNumber(obj, 'status')) {
 *   // type of obj -> { status: number }
 *   if (hasObject(obj, 'data')) {
 *     // type of obj -> { status: number } & { data: object }
 *   } else if (hasString('error')) {
 *     // type of obj -> { status: number } & { error: string }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys An `object` key to check for existence.
 */
export function hasObject<T, K extends string>(
  value: T,
  key: K
): value is T & View<K, object> {
  return has(value, key) && isObject(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` whose type tests positively when tested with
 * {@link isPlainObject}. If so, the type of the tested value is narrowed to reflect the existence of that key for
 * convenient access in the same scope. Returns `false` if the property key does not exist on the object or the value
 * stored by that key is not of type `object`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasNumber(obj, 'status')) {
 *   // type of obj -> { status: number }
 *   if (hasPlainObject(obj, 'data')) {
 *     // type of obj -> { status: number } & { data: object }
 *   } else if (hasString('error')) {
 *     // type of obj -> { status: number } & { error: string }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys A "plain" `object` key to check for existence.
 */
export function hasPlainObject<T, K extends string>(
  value: T,
  key: K
): value is T & View<K, object> {
  return has(value, key) && isPlainObject(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` whose type tests positively when tested with
 * {@link isInstance} when compared with the given constructor type `C`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not an instance of `C`.
 *
 * ```
 * class ServerResponse { ... }
 * // type of obj -> unknown
 * if (hasNumber(obj, 'status')) {
 *   // type of obj -> { status: number }
 *   if (hasInstance(obj, 'data', ServerResponse)) {
 *     // type of obj -> { status: number } & { data: ServerResponse }
 *   } else if (hasString('error')) {
 *     // type of obj -> { status: number } & { error: string }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys An instance of type `C` key to check for existence.
 */
export function hasInstance<T, K extends string, C extends AnyConstructor>(
  value: T,
  key: K,
  ctor: C
): value is T & View<K, InstanceType<C>> {
  return has(value, key) && value[key] instanceof ctor;
}

/**
 * Tests whether a value of type `T` contains a property `key` of type {@link AnyArray}. If so, the type of the tested
 * value is narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if
 * the property key does not exist on the object or the value stored by that key is not of type {@link AnyArray}.
 *
 * ```
 * // type of obj -> unknown
 * if (hasNumber(obj, 'offset')) {
 *   // type of obj -> { offset: number }
 *   if (hasNumber(obj, 'page') && hasArray(obj, 'items')) {
 *     // type of obj -> { offset: number } & { page: number } & { items: AnyArray }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys An `AnyArray` key to check for existence.
 */
export function hasArray<T, K extends string>(
  value: T,
  key: K
): value is T & View<K, AnyArray> {
  return has(value, key) && isArray(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type {@link AnyFunction}. If so, the type of the
 * tested value is narrowed to reflect the existence of that key for convenient access in the same scope. Returns
 * `false` if the property key does not exist on the object or the value stored by that key is not of type
 * {@link AnyFunction}.
 *
 * ```
 * // type of obj -> unknown
 * if (hasFunction(obj, 'callback')) {
 *   // type of obj -> { callback: AnyFunction }
 *   obj.callback(response);
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys An `Array` key to check for existence.
 */
export function hasFunction<T, K extends string>(
  value: T,
  key: K
): value is T & View<K, AnyFunction> {
  return has(value, key) && isFunction(value[key]);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array.
 *
 * ```
 * const obj = { foo: { bar: ['baz'] } };
 * const value = take(obj, 'foo.bar[0]');
 * // type of value -> unknown; value === 'baz'
 *
 * const value = take(obj, 'foo.bar.nothing', 'default');
 * // type of value -> unknown; value === 'default'
 *
 * const value = take(obj, 'foo["bar"][0]');
 * // type of value -> unknown; value === 'baz'
 *
 * const arr = [obj];
 * const value = take(arr, '[0].foo.bar[0]');
 * // type of value -> unknown; value === 'baz'
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function take(
  from: Nullable<object>,
  path: string,
  defaultValue?: unknown
): unknown {
  return valueOrDefault(
    path
      .split(/[\.\[\]\'\"]/)
      .filter(p => !!p)
      .reduce((r: unknown, p: string) => (has(r, p) ? r[p] : undefined), from),
    defaultValue
  );
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `string`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: ['baz'] } };
 * const value = takeString(obj, 'foo.bar[0]');
 * // type of value -> string; value -> 'baz'
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeString(
  from: Nullable<object>,
  path: string
): Nullable<string>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `string`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: ['baz'] } };
 * const value = takeString(obj, 'foo.bar[1]', 'default');
 * // type of value -> string; value -> 'default'
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeString(
  from: Nullable<object>,
  path: string,
  defaultValue: string
): string;
// underlying function
export function takeString(
  from: Nullable<object>,
  path: string,
  defaultValue?: string
): Nullable<string> {
  return valueOrDefault(asString(take(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `number`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1] } };
 * const value = takeNumber(obj, 'foo.bar[0]');
 * // type of value -> number; value -> 1
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeNumber(
  from: Nullable<object>,
  path: string
): Nullable<number>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `number`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1] } };
 * const value = takeNumber(obj, 'foo.bar[1]', 2);
 * // type of value -> number; value -> 2
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeNumber(
  from: Nullable<object>,
  path: string,
  defaultValue: number
): number;
// underlying function
export function takeNumber(
  from: Nullable<object>,
  path: string,
  defaultValue?: number
): Nullable<number> {
  return valueOrDefault(asNumber(take(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `boolean`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [true] } };
 * const value = takeBoolean(obj, 'foo.bar[0]');
 * // type of value -> boolean; value -> true
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeBoolean(
  from: Nullable<object>,
  path: string
): Nullable<boolean>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `boolean`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [true] } };
 * const value = takeBoolean(obj, 'foo.bar[1]', false);
 * // type of value -> boolean; value -> false
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeBoolean(
  from: Nullable<object>,
  path: string,
  defaultValue: boolean
): boolean;
// underlying function
export function takeBoolean(
  from: Nullable<object>,
  path: string,
  defaultValue?: boolean
): Nullable<boolean> {
  return valueOrDefault(asBoolean(take(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `object`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = takeObject(obj, 'foo.bar[0]');
 * // type of value -> object; value -> { name: 'baz' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeObject(
  from: Nullable<object>,
  path: string
): Nullable<object>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `object`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = takeObject(obj, 'foo.bar[1]', { name: 'buzz' });
 * // type of value -> object; value -> { name: 'buzz' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeObject(
  obj: Nullable<object>,
  path: string,
  defaultValue: object
): object;
// underlying function
export function takeObject(
  from: Nullable<object>,
  path: string,
  defaultValue?: object
): Nullable<object> {
  return valueOrDefault(asObject(take(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `object`, or
 * `undefined` if a value was not found or was not type-compatible. This differs from {@link takeObject} by way of
 * testing for the property value type compatibility using {@link isPlainObject} instead of {@link isObject}.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = takePlainObject(obj, 'foo.bar[0]');
 * // type of value -> object; value -> { name: 'baz' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takePlainObject(
  from: Nullable<object>,
  path: string
): Nullable<object>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `object`, or
 * `undefined` if a value was not found or was not type-compatible. This differs from {@link takeObject} by way of
 * testing for the property value type compatibility using {@link isPlainObject} instead of {@link isObject}.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = takePlainObject(obj, 'foo.bar[1]', { name: 'buzz' });
 * // type of value -> object; value -> { name: 'buzz' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takePlainObject(
  obj: Nullable<object>,
  path: string,
  defaultValue: object
): object;
// underlying function
export function takePlainObject(
  from: Nullable<object>,
  path: string,
  defaultValue?: object
): Nullable<object> {
  return valueOrDefault(asPlainObject(take(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an instance of
 * class type `C`, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * class Example { ... }
 * const obj = { foo: { bar: [new Example()] } };
 * const value = takeInstance(obj, 'foo.bar[0]', Example);
 * // type of value -> Example
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeInstance<C extends AnyConstructor>(
  from: Nullable<object>,
  path: string,
  ctor: C
): Nullable<InstanceType<C>>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an instance of
 * class type `C`, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * class Example { ... }
 * const obj = { foo: { bar: [new Example()] } };
 * const value = takeInstance(obj, 'foo.bar[0]', Example);
 * // type of value -> Example; value -> new Example()
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeInstance<C extends AnyConstructor>(
  from: Nullable<object>,
  path: string,
  ctor: C,
  defaultValue: InstanceType<C>
): InstanceType<C>;
// underlying function
export function takeInstance<C extends AnyConstructor>(
  from: Nullable<object>,
  path: string,
  ctor: C,
  defaultValue?: InstanceType<C>
): Nullable<InstanceType<C>> {
  return valueOrDefault(asInstance(take(from, path), ctor), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an
 * {@link AnyArray}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = takeArray(obj, 'foo.bar');
 * // type of value -> AnyArray; value -> [1, 2, 3]
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeArray(
  from: Nullable<object>,
  path: string
): Nullable<AnyArray>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an
 * {@link AnyArray}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = takeArray(obj, 'foo.baz', [4, 5, 6]);
 * // type of value -> AnyArray; value -> [4, 5, 6]
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeArray(
  from: Nullable<object>,
  path: string,
  defaultValue: AnyArray
): AnyArray;
// underlying function
export function takeArray(
  from: Nullable<object>,
  path: string,
  defaultValue?: AnyArray
): Nullable<AnyArray> {
  return valueOrDefault(asArray(take(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an
 * {@link AnyFunction}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [(arg: string) => `Hi, ${arg}`] } };
 * const value = takeFunction(obj, 'foo.bar[0]');
 * // type of value -> AnyArray; value -> (arg: string) => `Hi, ${arg}`
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeFunction(
  from: Nullable<object>,
  path: string
): Nullable<AnyFunction>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an
 * {@link AnyFunction}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [(arg: string) => `Hi, ${arg}`] } };
 * const value = takeFunction(obj, 'foo.bar[1]', (arg: string) => `Bye, ${arg}`);
 * // type of value -> AnyArray; value -> (arg: string) => `Bye, ${arg}`)
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeFunction(
  from: Nullable<object>,
  path: string,
  defaultValue: AnyFunction
): AnyFunction;
// underlying function
export function takeFunction(
  from: Nullable<object>,
  path: string,
  defaultValue?: AnyFunction
): Nullable<AnyFunction> {
  return valueOrDefault(asFunction(take(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * See {@link coerceAnyJson} for caveats regarding shallow type detection of `AnyJson` values from untyped sources.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = takeAnyJson(obj, 'foo.bar[0]');
 * // type of value -> AnyJson; value -> { a: 'b' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeAnyJson(
  from: Nullable<JsonCollection>,
  path: string
): Optional<AnyJson>;
/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = takeAnyJson(obj, 'foo.bar[1]', { c: 'd' });
 * // type of value -> AnyJson; value -> { c: 'd' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeAnyJson(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue: AnyJson
): AnyJson;
// underlying function
export function takeAnyJson(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue?: AnyJson
): Optional<AnyJson> {
  return valueOrDefault(coerceAnyJson(take(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = takeJsonMap(obj, 'foo.bar[0]');
 * // type of value -> JsonMap; value -> { a: 'b' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeJsonMap(
  from: Nullable<JsonCollection>,
  path: string
): Nullable<JsonMap>;
/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = takeJsonMap(obj, 'foo.bar[1]', { c: 'd' });
 * // type of value -> JsonMap; value -> { c: 'd' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeJsonMap(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function takeJsonMap(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue?: JsonMap
): Nullable<JsonMap> {
  return valueOrDefault(asJsonMap(takeAnyJson(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = takeJsonArray(obj, 'foo.bar');
 * // type of value -> JsonArray; value -> [1, 2, 3]
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function takeJsonArray(
  from: Nullable<JsonCollection>,
  path: string
): Nullable<JsonArray>;
/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = takeJsonArray(obj, 'foo.baz', [4, 5, 6]);
 * // type of value -> JsonArray; value -> [4, 5, 6]
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function takeJsonArray(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue: JsonArray
): JsonArray;
// underlying function
export function takeJsonArray(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue?: JsonArray
): Nullable<JsonArray> {
  return valueOrDefault(asJsonArray(takeAnyJson(from, path)), defaultValue);
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
export function keysOf<T extends object, K extends KeyOf<T>>(
  obj: Nullable<T>
): K[] {
  return Object.keys(obj || {}) as K[];
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
  obj: Nullable<T>
): Array<[K, T[K]]> {
  return Object.entries(obj || {}) as Array<[K, T[K]]>;
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
  obj: Nullable<T>
): Array<T[K]> {
  return Object.values(obj || {});
}

/**
 * Returns an array of all `string` keys in an object of type `T` whose values are neither `null` nor `undefined`.
 * This can be convenient for enumerating the keys of definitely assigned properties in an object or `Dictionary`.
 *
 * See also caveats outlined in {@link keysOf}.
 *
 * @param obj The object of interest.
 */
export function definiteKeysOf<T extends object>(
  obj: Nullable<T>
): Array<KeyOf<T>> {
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
>(obj: Nullable<T>): Array<[K, V]> {
  return entriesOf(obj).filter((entry): entry is [K, V] => entry[1] != null);
}

/**
 * Returns an array of all values of type `T` in a `Dictionary<T>` for values that are neither `null` nor `undefined`.
 * This can be convenient for enumerating all non-nullable values of unknown `Dictionary`.
 *
 * @param obj The object of interest.
 */
export function definiteValuesOf<T extends object>(
  obj: Nullable<T>
): Array<NonNullable<T[KeyOf<T>]>> {
  return definiteEntriesOf(obj).map(entry => entry[1]);
}
