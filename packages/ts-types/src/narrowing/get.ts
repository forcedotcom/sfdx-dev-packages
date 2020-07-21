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
  Nullable,
  Optional,
  Dictionary,
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
  asString,
  asDictionary,
} from './as';
import { coerceAnyJson } from './coerce';
import { has } from './has';
import { valueOrDefault } from './internal';

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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function get(from: unknown, path: string, defaultValue?: unknown): unknown {
  return valueOrDefault(
    path
      .split(/[.[\]'"]/)
      .filter((p) => !!p)
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
 * @param from Any value to query.
 * @param path The query path.
 */
export function getString(from: unknown, path: string): Nullable<string>;
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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getString(from: unknown, path: string, defaultValue: string): string;
// underlying function
export function getString(from: unknown, path: string, defaultValue?: string): Nullable<string> {
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
 * @param from Any value to query.
 * @param path The query path.
 */
export function getNumber(from: unknown, path: string): Nullable<number>;
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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getNumber(from: unknown, path: string, defaultValue: number): number;
// underlying function
export function getNumber(from: unknown, path: string, defaultValue?: number): Nullable<number> {
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
 * @param from Any value to query.
 * @param path The query path.
 */
export function getBoolean(from: unknown, path: string): Nullable<boolean>;
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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getBoolean(from: unknown, path: string, defaultValue: boolean): boolean;
// underlying function
export function getBoolean(from: unknown, path: string, defaultValue?: boolean): Nullable<boolean> {
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
 * @param from Any value to query.
 * @param path The query path.
 */
export function getObject<T extends object = object>(from: unknown, path: string): Nullable<T>;
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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getObject<T extends object = object>(from: unknown, path: string, defaultValue: T): T;
// underlying function
export function getObject<T extends object = object>(from: unknown, path: string, defaultValue?: T): Nullable<T> {
  return valueOrDefault(asObject<T>(get(from, path)), defaultValue);
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
 * @param from Any value to query.
 * @param path The query path.
 */
export function getPlainObject<T extends object = object>(from: unknown, path: string): Nullable<T>;
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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getPlainObject<T extends object = object>(from: unknown, path: string, defaultValue: T): T;
// underlying function
export function getPlainObject<T extends object = object>(from: unknown, path: string, defaultValue?: T): Nullable<T> {
  return valueOrDefault(asPlainObject<T>(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value of an object or array as a `Dictionary<T>`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = getDictionary<string>(obj, 'foo.bar[0]');
 * // type of value -> Dictionary<string>; value -> { name: 'baz' }
 * ```
 *
 * @param from Any value to query.
 * @param path The query path.
 */
export function getDictionary<T = unknown>(from: unknown, path: string): Nullable<Dictionary<T>>;
/**
 * Given a deep-search query path, returns an object property or array value of an object or array as an `Dictionary<T>`, or
 * `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ name: 'baz' }] } };
 * const value = getDictionary<string>(obj, 'foo.bar[1]', { name: 'buzz' });
 * // type of value -> Dictionary<string>; value -> { name: 'buzz' }
 * ```
 *
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getDictionary<T = unknown>(from: unknown, path: string, defaultValue: Dictionary<T>): Dictionary<T>;
// underlying function
export function getDictionary<T = unknown>(
  from: unknown,
  path: string,
  defaultValue?: Dictionary<T>
): Nullable<Dictionary<T>> {
  return valueOrDefault(asDictionary<T>(get(from, path)), defaultValue);
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
 * @param from Any value to query.
 * @param path The query path.
 */
export function getInstance<C extends AnyConstructor>(from: unknown, path: string, ctor: C): Nullable<InstanceType<C>>;
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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getInstance<C extends AnyConstructor>(
  from: unknown,
  path: string,
  ctor: C,
  defaultValue: InstanceType<C>
): InstanceType<C>;
// underlying function
export function getInstance<C extends AnyConstructor>(
  from: unknown,
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
 * @param from Any value to query.
 * @param path The query path.
 */
export function getArray(from: unknown, path: string): Nullable<AnyArray>;
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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getArray(from: unknown, path: string, defaultValue: AnyArray): AnyArray;
// underlying function
export function getArray(from: unknown, path: string, defaultValue?: AnyArray): Nullable<AnyArray> {
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
 * @param from Any value to query.
 * @param path The query path.
 */
export function getFunction(from: unknown, path: string): Nullable<AnyFunction>;
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
 * @param from Any value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getFunction(from: unknown, path: string, defaultValue: AnyFunction): AnyFunction;
// underlying function
export function getFunction(from: unknown, path: string, defaultValue?: AnyFunction): Nullable<AnyFunction> {
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
 * @param from The JSON value to query.
 * @param path The query path.
 */
export function getAnyJson(from: Optional<AnyJson>, path: string): Optional<AnyJson>;
/**
 * Given a deep-search query path, returns an object property or array value of a {@link JsonCollection} as an
 * {@link AnyJson}, or the given default if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = getAnyJson(obj, 'foo.bar[1]', { c: 'd' });
 * // type of value -> AnyJson; value -> { c: 'd' }
 * ```
 *
 * @param from The JSON value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getAnyJson(from: Optional<AnyJson>, path: string, defaultValue: AnyJson): AnyJson;
// underlying function
export function getAnyJson(from: Optional<AnyJson>, path: string, defaultValue?: AnyJson): Optional<AnyJson> {
  return valueOrDefault(coerceAnyJson(get(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value from an {@link AnyJson} as a
 * {@link JsonMap}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = getJsonMap(obj, 'foo.bar[0]');
 * // type of value -> JsonMap; value -> { a: 'b' }
 * ```
 *
 * @param from The JSON value to query.
 * @param path The query path.
 */
export function getJsonMap(from: Optional<AnyJson>, path: string): Nullable<JsonMap>;
/**
 * Given a deep-search query path, returns an object property or array value from an {@link AnyJson} as a
 * {@link JsonMap}, or the given default if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [{ a: 'b' }] } };
 * const value = getJsonMap(obj, 'foo.bar[1]', { c: 'd' });
 * // type of value -> JsonMap; value -> { c: 'd' }
 * ```
 *
 * @param from The JSON value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getJsonMap(from: Optional<AnyJson>, path: string, defaultValue: JsonMap): JsonMap;
// underlying function
export function getJsonMap(from: Optional<AnyJson>, path: string, defaultValue?: JsonMap): Nullable<JsonMap> {
  return valueOrDefault(asJsonMap(getAnyJson(from, path)), defaultValue);
}

/**
 * Given a deep-search query path, returns an object property or array value from an {@link AnyJson} as a
 * {@link JsonArray}, or `undefined` if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = getJsonArray(obj, 'foo.bar');
 * // type of value -> JsonArray; value -> [1, 2, 3]
 * ```
 *
 * @param from The JSON value to query.
 * @param path The query path.
 */
export function getJsonArray(from: Optional<AnyJson>, path: string): Nullable<JsonArray>;
/**
 * Given a deep-search query path, returns an object property or array value from an {@link AnyJson} as a
 * {@link JsonArray}, or the given default if a value was not found or was not type-compatible.
 *
 * ```
 * const obj = { foo: { bar: [1, 2, 3] } };
 * const value = getJsonArray(obj, 'foo.baz', [4, 5, 6]);
 * // type of value -> JsonArray; value -> [4, 5, 6]
 * ```
 *
 * @param from The JSON value to query.
 * @param path The query path.
 * @param defaultValue The default to return if the query result was not defined.
 */
export function getJsonArray(from: Optional<AnyJson>, path: string, defaultValue: JsonArray): JsonArray;
// underlying function
export function getJsonArray(from: Optional<AnyJson>, path: string, defaultValue?: JsonArray): Nullable<JsonArray> {
  return valueOrDefault(asJsonArray(getAnyJson(from, path)), defaultValue);
}
