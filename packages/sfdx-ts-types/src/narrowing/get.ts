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
} from '../types';
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
 * const value = get(obj, 'foo.bar[0]');
 * // type of value -> unknown; value === 'baz'
 *
 * const value = get(obj, 'foo.bar.nothing', 'default');
 * // type of value -> unknown; value === 'default'
 *
 * const value = get(obj, 'foo["bar"][0]');
 * // type of value -> unknown; value === 'baz'
 *
 * const arr = [obj];
 * const value = get(arr, '[0].foo.bar[0]');
 * // type of value -> unknown; value === 'baz'
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function get(
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
 * const value = getString(obj, 'foo.bar[0]');
 * // type of value -> string; value -> 'baz'
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getString(
  from: Nullable<object>,
  path: string
): Nullable<string>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `string`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: ['baz'] } };
 * const value = getString(obj, 'foo.bar[1]', 'default');
 * // type of value -> string; value -> 'default'
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getString(
  from: Nullable<object>,
  path: string,
  defaultValue: string
): string;
// underlying function
export function getString(
  from: Nullable<object>,
  path: string,
  defaultValue?: string
): Nullable<string> {
  return valueOrDefault(asString(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `number`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1] } };
 * const value = getNumber(obj, 'foo.bar[0]');
 * // type of value -> number; value -> 1
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getNumber(
  from: Nullable<object>,
  path: string
): Nullable<number>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `number`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1] } };
 * const value = getNumber(obj, 'foo.bar[1]', 2);
 * // type of value -> number; value -> 2
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getNumber(
  from: Nullable<object>,
  path: string,
  defaultValue: number
): number;
// underlying function
export function getNumber(
  from: Nullable<object>,
  path: string,
  defaultValue?: number
): Nullable<number> {
  return valueOrDefault(asNumber(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `boolean`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [true] } };
 * const value = getBoolean(obj, 'foo.bar[0]');
 * // type of value -> boolean; value -> true
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getBoolean(
  from: Nullable<object>,
  path: string
): Nullable<boolean>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `boolean`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [true] } };
 * const value = getBoolean(obj, 'foo.bar[1]', false);
 * // type of value -> boolean; value -> false
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getBoolean(
  from: Nullable<object>,
  path: string,
  defaultValue: boolean
): boolean;
// underlying function
export function getBoolean(
  from: Nullable<object>,
  path: string,
  defaultValue?: boolean
): Nullable<boolean> {
  return valueOrDefault(asBoolean(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `object`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = getObject(obj, 'foo.bar[0]');
 * // type of value -> object; value -> { name: 'baz' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getObject(
  from: Nullable<object>,
  path: string
): Nullable<object>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `object`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = getObject(obj, 'foo.bar[1]', { name: 'buzz' });
 * // type of value -> object; value -> { name: 'buzz' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getObject(
  obj: Nullable<object>,
  path: string,
  defaultValue: object
): object;
// underlying function
export function getObject(
  from: Nullable<object>,
  path: string,
  defaultValue?: object
): Nullable<object> {
  return valueOrDefault(asObject(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `object`, or
 * `undefined` if a value was not found or was not type-compatible. This differs from {@link getObject} by way of
 * testing for the property value type compatibility using {@link isPlainObject} instead of {@link isObject}.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = getPlainObject(obj, 'foo.bar[0]');
 * // type of value -> object; value -> { name: 'baz' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getPlainObject(
  from: Nullable<object>,
  path: string
): Nullable<object>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `object`, or
 * `undefined` if a value was not found or was not type-compatible. This differs from {@link getObject} by way of
 * testing for the property value type compatibility using {@link isPlainObject} instead of {@link isObject}.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = getPlainObject(obj, 'foo.bar[1]', { name: 'buzz' });
 * // type of value -> object; value -> { name: 'buzz' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getPlainObject(
  obj: Nullable<object>,
  path: string,
  defaultValue: object
): object;
// underlying function
export function getPlainObject(
  from: Nullable<object>,
  path: string,
  defaultValue?: object
): Nullable<object> {
  return valueOrDefault(asPlainObject(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an instance of
 * class type `C`, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * class Example { ... }
 * const obj = { foo: { bar: [new Example()] } };
 * const value = getInstance(obj, 'foo.bar[0]', Example);
 * // type of value -> Example
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getInstance<C extends AnyConstructor>(
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
 * const value = getInstance(obj, 'foo.bar[0]', Example);
 * // type of value -> Example; value -> new Example()
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getInstance<C extends AnyConstructor>(
  from: Nullable<object>,
  path: string,
  ctor: C,
  defaultValue: InstanceType<C>
): InstanceType<C>;
// underlying function
export function getInstance<C extends AnyConstructor>(
  from: Nullable<object>,
  path: string,
  ctor: C,
  defaultValue?: InstanceType<C>
): Nullable<InstanceType<C>> {
  return valueOrDefault(asInstance(get(from, path), ctor), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an
 * {@link AnyArray}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = getArray(obj, 'foo.bar');
 * // type of value -> AnyArray; value -> [1, 2, 3]
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getArray(
  from: Nullable<object>,
  path: string
): Nullable<AnyArray>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an
 * {@link AnyArray}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = getArray(obj, 'foo.baz', [4, 5, 6]);
 * // type of value -> AnyArray; value -> [4, 5, 6]
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getArray(
  from: Nullable<object>,
  path: string,
  defaultValue: AnyArray
): AnyArray;
// underlying function
export function getArray(
  from: Nullable<object>,
  path: string,
  defaultValue?: AnyArray
): Nullable<AnyArray> {
  return valueOrDefault(asArray(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an
 * {@link AnyFunction}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [(arg: string) => `Hi, ${arg}`] } };
 * const value = getFunction(obj, 'foo.bar[0]');
 * // type of value -> AnyArray; value -> (arg: string) => `Hi, ${arg}`
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getFunction(
  from: Nullable<object>,
  path: string
): Nullable<AnyFunction>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an
 * {@link AnyFunction}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [(arg: string) => `Hi, ${arg}`] } };
 * const value = getFunction(obj, 'foo.bar[1]', (arg: string) => `Bye, ${arg}`);
 * // type of value -> AnyArray; value -> (arg: string) => `Bye, ${arg}`)
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getFunction(
  from: Nullable<object>,
  path: string,
  defaultValue: AnyFunction
): AnyFunction;
// underlying function
export function getFunction(
  from: Nullable<object>,
  path: string,
  defaultValue?: AnyFunction
): Nullable<AnyFunction> {
  return valueOrDefault(asFunction(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * See {@link coerceAnyJson} for caveats regarding shallow type detection of `AnyJson` values from untyped sources.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = getAnyJson(obj, 'foo.bar[0]');
 * // type of value -> AnyJson; value -> { a: 'b' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getAnyJson(
  from: Nullable<JsonCollection>,
  path: string
): Optional<AnyJson>;
/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = getAnyJson(obj, 'foo.bar[1]', { c: 'd' });
 * // type of value -> AnyJson; value -> { c: 'd' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getAnyJson(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue: AnyJson
): AnyJson;
// underlying function
export function getAnyJson(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue?: AnyJson
): Optional<AnyJson> {
  return valueOrDefault(coerceAnyJson(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = getJsonMap(obj, 'foo.bar[0]');
 * // type of value -> JsonMap; value -> { a: 'b' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getJsonMap(
  from: Nullable<JsonCollection>,
  path: string
): Nullable<JsonMap>;
/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = getJsonMap(obj, 'foo.bar[1]', { c: 'd' });
 * // type of value -> JsonMap; value -> { c: 'd' }
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getJsonMap(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function getJsonMap(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue?: JsonMap
): Nullable<JsonMap> {
  return valueOrDefault(asJsonMap(getAnyJson(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = getJsonArray(obj, 'foo.bar');
 * // type of value -> JsonArray; value -> [1, 2, 3]
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 */
export function getJsonArray(
  from: Nullable<JsonCollection>,
  path: string
): Nullable<JsonArray>;
/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = getJsonArray(obj, 'foo.baz', [4, 5, 6]);
 * // type of value -> JsonArray; value -> [4, 5, 6]
 * ```
 *
 * @param from The object or array to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getJsonArray(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue: JsonArray
): JsonArray;
// underlying function
export function getJsonArray(
  from: Nullable<JsonCollection>,
  path: string,
  defaultValue?: JsonArray
): Nullable<JsonArray> {
  return valueOrDefault(asJsonArray(getAnyJson(from, path)), defaultValue);
}
