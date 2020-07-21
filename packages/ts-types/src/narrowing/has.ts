/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AnyArray, AnyConstructor, AnyFunction, AnyJson, JsonArray, JsonMap, Many, Optional, View } from '../types';
import {
  isAnyJson,
  isArray,
  isBoolean,
  isFunction,
  isJsonArray,
  isJsonMap,
  isNumber,
  isObject,
  isPlainObject,
  isString,
} from './is';

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
export function has<T extends unknown, K extends string>(value: T, keys: Many<K>): value is T & object & View<K> {
  return isObject(value) && (isArray(keys) ? keys.every((k) => k in value) : keys in value);
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
export function hasString<T extends unknown, K extends string>(
  value: T,
  key: K
): value is T & object & View<K, string> {
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
 *     // type of obj -> { offset: number } & { page: number } & { items: unknown[] }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys A `number` key to check for existence.
 */
export function hasNumber<T extends unknown, K extends string>(
  value: T,
  key: K
): value is T & object & View<K, number> {
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
export function hasBoolean<T extends unknown, K extends string>(
  value: T,
  key: K
): value is T & object & View<K, boolean> {
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
export function hasObject<T extends unknown, K extends string>(
  value: T,
  key: K
): value is T & object & View<K, object> {
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
export function hasPlainObject<T extends unknown, K extends string>(
  value: T,
  key: K
): value is T & object & View<K, object> {
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
export function hasInstance<T extends unknown, K extends string, C extends AnyConstructor>(
  value: Optional<T>,
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
export function hasArray<T extends unknown, K extends string>(
  value: Optional<T>,
  key: K
): value is T & object & View<K, AnyArray> {
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
 * @param keys An `AnyFunction` key to check for existence.
 */
export function hasFunction<T extends unknown, K extends string>(
  value: Optional<T>,
  key: K
): value is T & object & View<K, AnyFunction> {
  return has(value, key) && isFunction(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type {@link AnyJson}, _using a shallow test for
 * `AnyJson` compatibility_ (see {@link isAnyJson} for more information). If so, the type of the
 * tested value is narrowed to reflect the existence of that key for convenient access in the same scope. Returns
 * `false` if the property key does not exist on the object or the value stored by that key is not of type
 * {@link AnyJson}.
 *
 * ```
 * // type of obj -> unknown
 * if (hasAnyJson(obj, 'body')) {
 *   // type of obj -> { body: AnyJson }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys An `AnyJson` key to check for existence.
 */
export function hasAnyJson<T extends unknown, K extends string>(
  value: Optional<T>,
  key: K
): value is T & object & View<K, AnyJson> {
  return has(value, key) && isAnyJson(value[key]);
}

/**
 * Tests whether a value of type `T extends AnyJson` contains a property `key` of type {@link JsonMap}. If so, the type
 * of the tested value is narrowed to reflect the existence of that key for convenient access in the same scope. Returns
 * `false` if the property key does not exist on the object or the value stored by that key is not of type
 * {@link JsonMap}.
 *
 * ```
 * // type of obj -> unknown
 * if (hasJsonMap(obj, 'body')) {
 *   // type of obj -> { body: JsonMap }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys A `JsonMap` key to check for existence.
 */
export function hasJsonMap<T extends AnyJson, K extends string>(
  value: Optional<T>,
  key: K
): value is T & JsonMap & View<K, JsonMap> {
  return hasAnyJson(value, key) && isJsonMap(value[key]);
}

/**
 * Tests whether a value of type `T extends AnyJson` contains a property `key` of type {@link JsonArray}. If so, the
 * type of the tested value is narrowed to reflect the existence of that key for convenient access in the same scope.
 * Returns `false` if the property key does not exist on the object or the value stored by that key is not of type
 * {@link JsonArray}.
 *
 * ```
 * // type of obj -> unknown
 * if (hasJsonArray(obj, 'body')) {
 *   // type of obj -> { body: JsonArray }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys A `JsonArray` key to check for existence.
 */
export function hasJsonArray<T extends AnyJson, K extends string>(
  value: Optional<T>,
  key: K
): value is T & JsonMap & View<K, JsonArray> {
  return hasAnyJson(value, key) && isJsonArray(value[key]);
}
