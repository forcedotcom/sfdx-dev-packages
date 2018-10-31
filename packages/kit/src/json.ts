/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  AnyJson,
  isBoolean,
  isJsonArray,
  isJsonMap,
  isNumber,
  isString,
  JsonMap,
  Optional
} from '@salesforce/ts-types';
import {
  JsonDataFormatError,
  JsonParseError,
  JsonStringifyError
} from './errors';

/**
 * Parse JSON `string` data.
 *
 * @param data Data to parse.
 * @param jsonPath The file path from which the JSON was loaded.
 * @param throwOnEmpty If the data contents are empty.
 * @throws {@link JsonParseError} If the data contents are empty or the data is invalid.
 */
export function parseJson(
  data: string,
  jsonPath?: string,
  throwOnEmpty = true
): AnyJson {
  data = data.trim();
  if (!throwOnEmpty && data.length === 0) data = '{}';
  try {
    return JSON.parse(data);
  } catch (error) {
    throw JsonParseError.create(error, data, jsonPath);
  }
}

/**
 * Parse JSON `string` data, expecting the result to be a `JsonMap`.
 *
 * @param data The string data to parse.
 * @param jsonPath The file path from which the JSON was loaded.
 * @param throwOnEmpty If the data contents are empty.
 * @throws {@link JsonParseError} If the data contents are empty or the data is invalid.
 * @throws {@link JsonDataFormatError} If the data contents are not a `JsonMap`.
 */
export function parseJsonMap(
  data: string,
  jsonPath?: string,
  throwOnEmpty?: boolean
): JsonMap {
  const json = parseJson(data, jsonPath, throwOnEmpty);
  if (json === null || isJsonArray(json) || typeof json !== 'object') {
    throw new JsonDataFormatError('Expected parsed JSON data to be an object');
  }
  return json;
}

/**
 * Perform a deep clone of an object or array compatible with JSON stringification.
 * Object fields that are not compatible with stringification will be omitted. Array
 * entries that are not compatible with stringification will be censored as `null`.
 *
 * @param obj A JSON-compatible object or array to clone.
 * @throws {@link JsonStringifyError} If the object contains circular references or causes
 *  other JSON stringification errors.
 */
export function cloneJson<T extends object>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    throw new JsonStringifyError(err);
  }
}

/**
 * Finds all elements of type `T` with a given name in a `JsonMap`. Not suitable for use
 * with object graphs containing circular references. The specification of an appropriate
 * type `T` that will satisfy all matching element values is the responsibility of the caller.
 *
 * @param json The `JsonMap` tree to search for elements of the given name.
 * @param name The name of elements to search for.
 */
export function getJsonValuesByName<T extends AnyJson = AnyJson>(
  json: JsonMap,
  name: string
): T[] {
  let matches: T[] = [];
  if (json.hasOwnProperty(name)) {
    matches.push(json[name] as T); // Asserting T here assumes the caller knows what they are asking for
  }
  const maybeRecurse = (element: Optional<AnyJson>): void => {
    if (isJsonMap(element)) {
      matches = matches.concat(getJsonValuesByName(element, name));
    }
  };
  Object.values(json).forEach(
    value =>
      isJsonArray(value) ? value.forEach(maybeRecurse) : maybeRecurse(value)
  );
  return matches;
}

/**
 * Tests whether an `AnyJson` value contains another `AnyJson` value.  This is a shallow
 * check only and does not recurse deeply into collections.
 *
 * @param json The container to search.
 * @param value The value search for.
 */
export function jsonIncludes(
  json: Optional<AnyJson>,
  value: Optional<AnyJson>
): boolean {
  if (json == null || isNumber(json) || isBoolean(json)) return false;
  if (isJsonMap(json)) return Object.values(json).includes(value);
  if (isJsonArray(json)) return json.includes(value);
  if (isString(value)) return json.includes(value);
  return false;
}
