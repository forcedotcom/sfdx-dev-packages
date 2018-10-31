/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AnyArray, AnyConstructor, AnyFunction, Many, View } from '../types';
import {
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isPlainObject,
  isString
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
