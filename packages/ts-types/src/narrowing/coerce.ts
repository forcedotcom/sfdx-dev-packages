/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AnyJson, JsonArray, JsonMap, Nullable, Optional } from '../types';
import { asJsonArray, asJsonMap } from './as';
import { isAnyJson } from './is';

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
export function coerceAnyJson(value: unknown, defaultValue?: AnyJson): Optional<AnyJson> {
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
export function coerceJsonMap<T extends object>(value: Nullable<T>): Optional<JsonMap>;
/**
 * Narrows an object of type `T` to a `JsonMap` using a shallow type-compatibility check. Use this when the source of
 * the object is known to be JSON-compatible and you want simple type coercion to a `JsonMap`. Use {@link toJsonMap}
 * instead when the `value` object _cannot_ be guaranteed to be JSON-compatible and you want an assurance of runtime
 * type safety. This is a shortcut for writing `asJsonMap(coerceAnyJson(value)) || defaultValue`.
 *
 * @param value The object to coerce.
 * @param defaultValue The default to return if `value` was not defined.
 */
export function coerceJsonMap<T extends object>(value: Nullable<T>, defaultValue: JsonMap): JsonMap;
// underlying function
export function coerceJsonMap<T extends object>(value: Nullable<T>, defaultValue?: JsonMap): Optional<JsonMap> {
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
export function coerceJsonArray<T>(value: Nullable<T[]>, defaultValue: JsonArray): JsonArray;
// underlying method
export function coerceJsonArray<T>(value: Nullable<T[]>, defaultValue?: JsonArray): Optional<JsonArray> {
  return asJsonArray(coerceAnyJson(value)) || defaultValue;
}
