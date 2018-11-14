/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * A staging area for either introducing or removing type and functions, incrementally.
 */

import {
  definiteEntriesOf,
  get,
  has,
  hasArray,
  hasBoolean,
  hasFunction,
  hasInstance,
  hasNumber,
  hasObject,
  hasPlainObject,
  hasString,
  isFunction,
  isString
} from '../narrowing';
import { AnyArray, AnyConstructor, AnyFunction, Dictionary, Many, Nullable, Optional, View } from '../types';

/**
 * @ignore
 */
export type PrimitiveType = 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined';

/**
 * @ignore
 */
export type VerifiableType = PrimitiveType | AnyConstructor;

/**
 * @ignore
 */
export type PropertyShape = { type: VerifiableType; optional: boolean };

/**
 * @ignore
 */
export type ObjectShape = Dictionary<VerifiableType | PropertyShape>;

/**
 * @ignore
 */
export function is<T extends object>(obj: Nullable<object>, shape: ObjectShape): obj is T {
  const isVerifiable = (v: VerifiableType | PropertyShape): v is VerifiableType => isString(v) || isFunction(v);
  return (
    !obj ||
    definiteEntriesOf(shape)
      .map(([k, v]) => ({
        key: k,
        ...(isVerifiable(v) ? { type: v, optional: false } : v)
      }))
      .every(({ key, type, optional }) => {
        return (
          (optional && !(key in obj)) ||
          (isString(type) ? typeof get(obj, key) === type : get(obj, key) instanceof type)
        );
      })
  );
}

/**
 * @ignore
 */
// type Foo = { name: string, bar: Bar };
// class Bar { public baz = 'bar'; }
// const maybeFoo: object = { name: 'bar', bar: new Bar() };
// const foo = ensure(as<Foo>(maybeFoo, { name: 'string', bar: Bar }));
export function as<T extends object>(obj: Nullable<object>, shape: ObjectShape): Optional<T> {
  return is<T>(obj, shape) ? obj : undefined;
}

/**
 * A view over an `object` with constrainable, optional properties.
 *
 * @ignore
 */
export type ViewOptional<K extends string, V = unknown> = { [_ in K]?: V };

/**
 * @ignore
 */
export function hasNull<T, K extends string>(value: T, key: K): value is T & View<K, string> {
  return has(value, key) && value[key] == null;
}

/**
 * @ignore
 */
export function view<T, K extends string>(value: Nullable<T>, keys: Many<K>): Optional<T & ViewOptional<K>> {
  return has(value, keys) ? value : undefined;
}

/**
 * @ignore
 */
function viewOptional<T, K extends string, R extends T>(
  value: Nullable<T>,
  key: K,
  hasType: (value: Nullable<T>, key: K) => value is R
): Optional<T & ViewOptional<K, R>> {
  return hasType(value, key) ? value : hasNull(value, key) ? value : undefined;
}

/**
 * @ignore
 */
export function viewString<T, K extends string>(value: Nullable<T>, key: K): Optional<T & ViewOptional<K, string>> {
  return viewOptional(value, key, hasString);
}

/**
 * @ignore
 */
export function viewNumber<T, K extends string>(value: Nullable<T>, key: K): Optional<T & ViewOptional<K, number>> {
  return viewOptional(value, key, hasNumber);
}

/**
 * @ignore
 */
export function viewBoolean<T, K extends string>(value: Nullable<T>, key: K): Optional<T & ViewOptional<K, boolean>> {
  return viewOptional(value, key, hasBoolean);
}

/**
 * @ignore
 */
export function viewObject<T, K extends string>(value: Nullable<T>, key: K): Optional<T & ViewOptional<K, object>> {
  return viewOptional(value, key, hasObject);
}

/**
 * @ignore
 */
export function viewPlainObject<T, K extends string>(
  value: Nullable<T>,
  key: K
): Optional<T & ViewOptional<K, object>> {
  return viewOptional(value, key, hasPlainObject);
}

/**
 * @ignore
 */
export function viewInstance<T, K extends string, C extends AnyConstructor>(
  value: Nullable<T>,
  key: K,
  ctor: C
): Optional<T & ViewOptional<K, InstanceType<C>>> {
  const hasType = (v: Nullable<T>, k: K): v is T & ViewOptional<K, InstanceType<C>> => hasInstance(v, k, ctor);
  return viewOptional(value, key, hasType);
}

/**
 * @ignore
 */
export function viewArray<T, K extends string>(value: Nullable<T>, key: K): Optional<T & ViewOptional<K, AnyArray>> {
  return viewOptional(value, key, hasArray);
}

/**
 * @ignore
 */
export function viewFunction<T, K extends string>(
  value: Nullable<T>,
  key: K
): Optional<T & ViewOptional<K, AnyFunction>> {
  return viewOptional(value, key, hasFunction);
}
