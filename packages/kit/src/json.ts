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
import { JsonDataFormatError, JsonParseError, JsonStringifyError } from './errors';

/**
 * Parse JSON `string` data.
 *
 * @param data Data to parse.
 * @param jsonPath The file path from which the JSON was loaded.
 * @param throwOnEmpty If the data contents are empty.
 * @throws {@link JsonParseError} If the data contents are empty or the data is invalid.
 */
export function parseJson(data: string, jsonPath?: string, throwOnEmpty = true): AnyJson {
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
 * ```
 * const json = parseJson(myJsonString);
 * // typeof json -> AnyJson
 * ```
 *
 * If you are the producer of the JSON being parsed or have a high degree of confidence in the source of the JSON
 * (e.g. static resources in your project or unwavering data services of high integrity) then you may provide a more
 * specific type as the type parameter, `T`. This practice is _not_ recommended unless you are fully confident in the
 * ability of the type provided to accurately reflect the parsed data, given that _no_ runtime checks will be performed
 * by this method to validate the JSON. In particular, despite the fact that the provided type must extend `JsonMap`,
 * it is possible to circumvent the compiler's ability to do strict null checking by failing to capture `undefined` or
 * `null` property states in the types you apply. It's a best practice to mark all properties of such types as
 * optional, especially when in doubt.
 *
 * ```
 * interface Location extends JsonMap { lat: number; lng: number; }
 * interface WayPoint extends JsonMap { name: string; loc: Location; }
 * const json = JSON.stringify({ name: 'Bill', loc: { lat: 10.0, lng: -10.0 } });
 * // Warning -- since the properties in the interfaces above are non-optional, the type assertion below is not
 * // perfectly type-sound -- make sure you trust your JSON data exactly conforms to the interface(s) you supply,
 * // or you are risking runtime errors!
 * const wayPoint = parseJsonMap<WayPoint>(json);
 * // typeof wayPoint -> WayPoint
 * ```
 *
 * @param data The string data to parse.
 * @param jsonPath The file path from which the JSON was loaded.
 * @param throwOnEmpty If the data contents are empty.
 * @throws {@link JsonParseError} If the data contents are empty or the data is invalid.
 * @throws {@link JsonDataFormatError} If the data contents are not a `JsonMap`.
 */
export function parseJsonMap<T extends JsonMap = JsonMap>(data: string, jsonPath?: string, throwOnEmpty?: boolean): T {
  const json = parseJson(data, jsonPath, throwOnEmpty);
  if (json === null || isJsonArray(json) || typeof json !== 'object') {
    throw new JsonDataFormatError('Expected parsed JSON data to be an object');
  }
  return json as T; // apply the requested type assertion
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
export function getJsonValuesByName<T extends AnyJson = AnyJson>(json: JsonMap, name: string): T[] {
  let matches: T[] = [];
  if (json.hasOwnProperty(name)) {
    matches.push(json[name] as T); // Asserting T here assumes the caller knows what they are asking for
  }
  const maybeRecurse = (element: Optional<AnyJson>): void => {
    if (isJsonMap(element)) {
      matches = matches.concat(getJsonValuesByName(element, name));
    }
  };
  Object.values(json).forEach(value => (isJsonArray(value) ? value.forEach(maybeRecurse) : maybeRecurse(value)));
  return matches;
}

/**
 * Tests whether an `AnyJson` value contains another `AnyJson` value.  This is a shallow
 * check only and does not recurse deeply into collections.
 *
 * @param json The container to search.
 * @param value The value search for.
 */
export function jsonIncludes(json: Optional<AnyJson>, value: Optional<AnyJson>): boolean {
  if (json == null || value === undefined || isNumber(json) || isBoolean(json)) return false;
  if (isJsonMap(json)) return Object.values(json).includes(value);
  if (isJsonArray(json)) return json.includes(value);
  if (isString(value)) return json.includes(value);
  return false;
}
