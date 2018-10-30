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
  JsonCollection,
  JsonMap,
  Nullable,
  Optional
} from 'src/types';
import {
  asArray,
  asBoolean,
  asFunction,
  asInstance,
  asJsonArray,
  asJsonMap,
  asNumber,
  asObject,
  asPlainObject,
  asString
} from './as';
import { valueOrDefault } from './base';
import { coerceAnyJson } from './coerce';
import { has } from './has';

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
