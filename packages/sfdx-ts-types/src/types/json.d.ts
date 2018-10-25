/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @module types
 */

import { Dictionary } from './collection';
import { Nullable } from './union';

/**
 * Any valid JSON primitive value.
 */
export type JsonPrimitive = Nullable<boolean | number | string>;

/**
 * Any valid JSON collection value.
 */
export type JsonCollection = JsonMap | JsonArray;

/**
 * Any valid JSON value.
 */
export type AnyJson = JsonPrimitive | JsonCollection;

/**
 * Any JSON-compatible object.
 */
export interface JsonMap extends Dictionary<AnyJson> {}

/**
 * Any JSON-compatible array.
 */
export interface JsonArray extends Array<AnyJson> {}
