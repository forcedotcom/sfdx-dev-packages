/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { JsonCloneError, UnexpectedValueTypeError } from './errors';
import * as narrowing from './narrowing';
import { Dictionary, JsonArray, JsonMap, Nullable, Optional } from './types';

describe('type narrowing', () => {
  describe('is type', () => {
    describe('isString', () => {
      it('should return false when passed undefined', () => {
        expect(narrowing.isString(undefined)).to.be.false;
      });

      it('should return true when passed a string', () => {
        const value = '';
        expect(narrowing.isString(value)).to.be.true;
      });
    });

    describe('isNumber', () => {
      it('should return false when passed undefined', () => {
        expect(narrowing.isNumber(undefined)).to.be.false;
      });

      it('should return true when passed a number', () => {
        const value = 0;
        expect(narrowing.isNumber(value)).to.be.true;
      });
    });

    describe('isBoolean', () => {
      it('should return false when passed undefined', () => {
        expect(narrowing.isBoolean(undefined)).to.be.false;
      });

      it('should return true when passed a boolean', () => {
        const value = false;
        expect(narrowing.isBoolean(value)).to.be.true;
      });
    });

    describe('isObject', () => {
      it('should reject undefined', () => {
        expect(narrowing.isObject(undefined)).to.be.false;
      });

      it('should reject null', () => {
        expect(narrowing.isObject(null)).to.be.false;
      });

      it('should reject string', () => {
        expect(narrowing.isObject('string')).to.be.false;
      });

      it('should reject number', () => {
        expect(narrowing.isObject(1)).to.be.false;
      });

      it('should reject boolean', () => {
        expect(narrowing.isObject(true)).to.be.false;
      });

      it('should accept array', () => {
        expect(narrowing.isObject([])).to.be.true;
      });

      it('should accept object', () => {
        expect(narrowing.isObject({})).to.be.true;
      });

      it('should accept function', () => {
        expect(narrowing.isObject([])).to.be.true;
      });
    });

    describe('isPlainObject', () => {
      it('should reject undefined', () => {
        expect(narrowing.isPlainObject(undefined)).to.be.false;
      });

      it('should reject null', () => {
        expect(narrowing.isPlainObject(null)).to.be.false;
      });

      it('should reject string', () => {
        expect(narrowing.isPlainObject('string')).to.be.false;
      });

      it('should reject number', () => {
        expect(narrowing.isPlainObject(1)).to.be.false;
      });

      it('should reject boolean', () => {
        expect(narrowing.isPlainObject(true)).to.be.false;
      });

      it('should reject array', () => {
        expect(narrowing.isPlainObject([])).to.be.false;
      });

      it('should accept object', () => {
        expect(narrowing.isPlainObject({})).to.be.true;
      });

      it('should reject function', () => {
        expect(narrowing.isPlainObject(() => {})).to.be.false;
      });
    });

    describe('isArray', () => {
      it('should reject undefined', () => {
        expect(narrowing.isArray(undefined)).to.be.false;
      });

      it('should reject null', () => {
        expect(narrowing.isArray(null)).to.be.false;
      });

      it('should reject string', () => {
        expect(narrowing.isArray('string')).to.be.false;
      });

      it('should reject number', () => {
        expect(narrowing.isArray(1)).to.be.false;
      });

      it('should reject boolean', () => {
        expect(narrowing.isArray(true)).to.be.false;
      });

      it('should accept array', () => {
        expect(narrowing.isArray([])).to.be.true;
      });

      it('should reject object', () => {
        expect(narrowing.isArray({})).to.be.false;
      });

      it('should reject array-like', () => {
        expect(narrowing.isArray({ length: 1, 0: 'test' })).to.be.false;
      });

      it('should reject function', () => {
        expect(narrowing.isArray(() => {})).to.be.false;
      });
    });

    describe('isFunction', () => {
      it('should reject undefined', () => {
        expect(narrowing.isFunction(undefined)).to.be.false;
      });

      it('should reject null', () => {
        expect(narrowing.isFunction(null)).to.be.false;
      });

      it('should reject string', () => {
        expect(narrowing.isFunction('string')).to.be.false;
      });

      it('should reject number', () => {
        expect(narrowing.isFunction(1)).to.be.false;
      });

      it('should reject boolean', () => {
        expect(narrowing.isFunction(true)).to.be.false;
      });

      it('should reject array', () => {
        expect(narrowing.isFunction([])).to.be.false;
      });

      it('should reject object', () => {
        expect(narrowing.isFunction({})).to.be.false;
      });

      it('should accept function expressions', () => {
        expect(narrowing.isFunction(function() {})).to.be.true; // tslint:disable-line:only-arrow-functions
      });

      it('should accept arrow functions', () => {
        expect(narrowing.isFunction(() => {})).to.be.true;
      });
    });

    describe('isKeyOf', () => {
      it('should return false when passed a non-key string', () => {
        expect(narrowing.isKeyOf('foo', { bar: true })).to.be.false;
      });

      it('should return true when passed a key string', () => {
        expect(narrowing.isKeyOf('bar', { bar: true })).to.be.true;
      });
    });

    describe('isAnyJson', () => {
      it('should return false when passed undefined', () => {
        expect(narrowing.isAnyJson(undefined)).to.be.false;
      });

      it('should return false when passed a function', () => {
        expect(narrowing.isAnyJson(() => {})).to.be.false;
      });

      it('should return true when passed null', () => {
        const value = null;
        expect(narrowing.isAnyJson(value)).to.be.true;
      });

      it('should return true when passed a string', () => {
        const value = '';
        expect(narrowing.isAnyJson(value)).to.be.true;
      });

      it('should return true when passed a number', () => {
        const value = 0;
        expect(narrowing.isAnyJson(value)).to.be.true;
      });

      it('should return true when passed a boolean', () => {
        const value = false;
        expect(narrowing.isAnyJson(value)).to.be.true;
      });

      it('should return true when passed a JsonMap', () => {
        const value = {};
        expect(narrowing.isAnyJson(value)).to.be.true;
      });

      it('should return true when passed a JsonArray', () => {
        const value: JsonArray = [];
        expect(narrowing.isAnyJson(value)).to.be.true;
      });
    });

    describe('isJsonMap', () => {
      it('should return false when passed undefined', () => {
        expect(narrowing.isJsonMap(undefined)).to.be.false;
      });

      it('should return true when passed a JsonMap', () => {
        const value = { a: 'b', c: 'd' };
        expect(narrowing.isJsonMap(value)).to.be.true;
      });
    });

    describe('isJsonArray', () => {
      it('should return false when passed undefined', () => {
        expect(narrowing.isJsonArray(undefined)).to.be.false;
      });

      it('should return true when passed a JsonArray', () => {
        const value = ['a', 'b'];
        expect(narrowing.isJsonArray(value)).to.be.true;
      });
    });
  });

  describe('as type', () => {
    describe('asString', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.asString(undefined)).to.be.undefined;
      });

      it('should return a string when passed a string', () => {
        const value = 'string';
        expect(narrowing.asString(value)).to.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = 'string';
        expect(narrowing.asString(undefined, def)).to.equal(def);
      });
    });

    describe('asNumber', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.asNumber(undefined)).to.be.undefined;
      });

      it('should return a number when passed a number', () => {
        const value = 1;
        expect(narrowing.asNumber(value)).to.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = 1;
        expect(narrowing.asNumber(undefined, def)).to.equal(def);
      });
    });

    describe('asBoolean', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.asBoolean(undefined)).to.be.undefined;
      });

      it('should return a boolean when passed a boolean', () => {
        const value = true;
        expect(narrowing.asBoolean(value)).to.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = true;
        expect(narrowing.asBoolean(undefined, def)).to.equal(def);
      });
    });

    describe('asJsonMap', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.asJsonMap(undefined)).to.be.undefined;
      });

      it('should return a JsonMap when passed a JsonMap', () => {
        const value = { a: 'b', c: 'd' };
        expect(narrowing.asJsonMap(value)).to.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = { a: 'b', c: 'd' };
        expect(narrowing.asJsonMap(undefined, def)).to.equal(def);
      });
    });

    describe('asJsonArray', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.asJsonArray(undefined)).to.be.undefined;
      });

      it('should return a JsonArray when passed a JsonArray', () => {
        const value = ['a', 'b'];
        expect(narrowing.asJsonArray(value)).to.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = ['a', 'b'];
        expect(narrowing.asJsonArray(undefined, def)).to.equal(def);
      });
    });
  });

  describe('coerce type', () => {
    describe('coerceAnyJson', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.coerceAnyJson(undefined)).to.be.undefined;
      });

      it('should return a string when passed a string', () => {
        const value = 'string';
        expect(narrowing.coerceAnyJson(value)).to.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = 'string';
        expect(narrowing.coerceAnyJson(undefined, def)).to.equal(def);
      });
    });

    describe('coerceJsonMap', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.coerceJsonMap(undefined)).to.be.undefined;
      });

      it('should return a JsonMap when passed a JsonMap', () => {
        const value = { a: 'b', c: 'd' };
        expect(narrowing.coerceJsonMap(value)).to.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = { a: 'b', c: 'd' };
        expect(narrowing.coerceJsonMap(undefined, def)).to.equal(def);
      });
    });

    describe('coerceJsonArray', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.coerceJsonArray(undefined)).to.be.undefined;
      });

      it('should return a JsonArray when passed a JsonArray', () => {
        const value = ['a', 'b'];
        expect(narrowing.coerceJsonArray(value)).to.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = ['a', 'b'];
        expect(narrowing.coerceJsonArray(undefined, def)).to.equal(def);
      });
    });
  });

  describe('to type', () => {
    describe('toAnyJson', () => {
      it('should return undefined when passed undefined', () => {
        const value = undefined;
        expect(narrowing.toAnyJson(value)).to.equal(value);
      });

      it('should return a string when passed a string', () => {
        const value = '';
        expect(narrowing.toAnyJson(value)).to.equal(value);
      });

      it('should return a number when passed a number', () => {
        const value = 0;
        expect(narrowing.toAnyJson(value)).to.equal(value);
      });

      it('should return a boolean when passed a boolean', () => {
        const value = false;
        expect(narrowing.toAnyJson(value)).to.equal(value);
      });

      it('should return an object when passed an object', () => {
        const value = { a: 'b', c: 'd' };
        expect(narrowing.toAnyJson(value)).to.deep.equal(value);
      });

      it('should return an array when passed an array', () => {
        const value = ['a', 'b'];
        expect(narrowing.toAnyJson(value)).to.deep.equal(value);
      });
    });

    describe('toJsonMap', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.toJsonMap(undefined)).to.be.undefined;
      });

      it('should return a JsonMap when passed a JsonMap', () => {
        const value = { a: 'b', c: 'd' };
        expect(narrowing.toJsonMap(value)).to.deep.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = { a: 'b', c: 'd' };
        expect(narrowing.toJsonMap(undefined, def)).to.equal(def);
      });

      it('should omit non-JSON values when passed an object with non-JSON values', () => {
        const value = { a: 'b', c: 'd', e: () => {} };
        expect(narrowing.toJsonMap(value)).to.deep.equal({ a: 'b', c: 'd' });
      });

      it('should throw when passed an object with circular references', () => {
        const a: Dictionary = {};
        const b: Dictionary = {};
        a.b = b;
        b.a = a;
        const value = a;
        expect(() => narrowing.toJsonMap(value)).to.throw(JsonCloneError);
      });
    });

    describe('toJsonArray', () => {
      it('should return undefined when passed undefined', () => {
        expect(narrowing.toJsonArray(undefined)).to.be.undefined;
      });

      it('should return a JsonArray when passed a JsonArray', () => {
        const value = ['a', 'b'];
        expect(narrowing.toJsonArray(value)).to.deep.equal(value);
      });

      it('should return the default when passed undefined and a default', () => {
        const def = ['a', 'b'];
        expect(narrowing.toJsonArray(undefined, def)).to.equal(def);
      });

      it('should omit non-JSON values when passed an array with non-JSON values', () => {
        const value = ['a', null, 'b', () => {}];
        expect(narrowing.toJsonArray(value)).to.deep.equal([
          'a',
          null,
          'b',
          null
        ]);
      });

      it('should throw when passed an array with circular references', () => {
        const a: Dictionary = {};
        const b: Dictionary = {};
        a.b = b;
        b.a = a;
        const value = [a, b];
        expect(() => narrowing.toJsonArray(value)).to.throw(JsonCloneError);
      });
    });
  });

  describe('ensure type', () => {
    describe('ensure', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensure(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should raise an error when passed null', () => {
        expect(() => narrowing.ensure(null)).to.throw(UnexpectedValueTypeError);
      });

      it('should return a string when passed a string', () => {
        const value = 'string';
        expect(narrowing.ensure(value)).to.equal(value);
      });
    });

    describe('ensureAnyJson', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureAnyJson(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a string when passed a string', () => {
        const value = 'string';
        expect(narrowing.ensureAnyJson(value)).to.equal(value);
      });
    });

    describe('ensureString', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureString(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a string when passed a string', () => {
        const value = 'string';
        expect(narrowing.ensureString(value)).to.equal(value);
      });
    });

    describe('ensureNumber', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureNumber(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a number when passed a number', () => {
        const value = 1;
        expect(narrowing.ensureNumber(value)).to.equal(value);
      });
    });

    describe('ensureBoolean', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureBoolean(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a boolean when passed a number', () => {
        const value = true;
        expect(narrowing.ensureBoolean(value)).to.equal(value);
      });
    });

    describe('ensureJsonMap', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureJsonMap(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a JsonMap when passed a JsonMap', () => {
        const value = { a: 'b', c: 'd' };
        expect(narrowing.ensureJsonMap(value)).to.deep.equal(value);
      });
    });

    describe('ensureJsonArray', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureJsonArray(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a JsonArray when passed a JsonArray', () => {
        const value = ['a', 'b'];
        expect(narrowing.ensureJsonArray(value)).to.deep.equal(value);
      });
    });
  });

  describe('get as type', () => {
    const data: JsonMap = {
      inner: {
        s: 'string',
        n: 1,
        b: true,
        m: { a: 'b', c: 'd' },
        a: ['a', 'b']
      }
    };

    describe('getAsAnyJson', () => {
      it('should return undefined when passed an empty json map', () => {
        expect(narrowing.getAsAnyJson(undefined, 'foo')).to.be.undefined;
      });

      it('should return undefined when passed an unknown path', () => {
        expect(narrowing.getAsAnyJson(data, 'foo')).to.be.undefined;
      });

      it('should return a default when passed an unknown path and a default', () => {
        const def = 'def';
        expect(narrowing.getAsAnyJson(data, 'foo', def)).to.equal(def);
      });

      it('should return a string when passed a path to a string', () => {
        const value = 'string';
        const path = 'inner.s';
        expect(narrowing.getAsAnyJson(data, path)).to.equal(value);
      });

      it('should return a string when passed an array path to a string', () => {
        const value = 'string';
        const path = ['inner', 's'];
        expect(narrowing.getAsAnyJson(data, path)).to.equal(value);
      });
    });

    describe('getAsString', () => {
      it('should return undefined when passed an empty json map', () => {
        expect(narrowing.getAsString(undefined, 'foo')).to.be.undefined;
      });

      it('should return undefined when passed an unknown path', () => {
        expect(narrowing.getAsString(data, 'foo')).to.be.undefined;
      });

      it('should return a default when passed an unknown path and a default', () => {
        const def = 'def';
        expect(narrowing.getAsString(data, 'foo', def)).to.equal(def);
      });

      it('should return a string when passed a path to a string', () => {
        const value = 'string';
        const path = 'inner.s';
        expect(narrowing.getAsString(data, path)).to.equal(value);
      });
    });

    describe('getAsNumber', () => {
      it('should return undefined when passed an empty json map', () => {
        expect(narrowing.getAsNumber(undefined, 'foo')).to.be.undefined;
      });

      it('should return undefined when passed an unknown path', () => {
        expect(narrowing.getAsNumber(data, 'foo')).to.be.undefined;
      });

      it('should return a default when passed an unknown path and a default', () => {
        const def = 1;
        expect(narrowing.getAsNumber(data, 'foo', def)).to.equal(def);
      });

      it('should return a number when passed a path to a number', () => {
        const value = 1;
        const path = 'inner.n';
        expect(narrowing.getAsNumber(data, path)).to.equal(value);
      });
    });

    describe('getAsBoolean', () => {
      it('should return undefined when passed an empty json map', () => {
        expect(narrowing.getAsBoolean(undefined, 'foo')).to.be.undefined;
      });

      it('should return undefined when passed an unknown path', () => {
        expect(narrowing.getAsBoolean(data, 'foo')).to.be.undefined;
      });

      it('should return a default when passed an unknown path and a default', () => {
        const def = true;
        expect(narrowing.getAsBoolean(data, 'foo', def)).to.equal(def);
      });

      it('should return a boolean when passed a path to a boolean', () => {
        const value = true;
        const path = 'inner.b';
        expect(narrowing.getAsBoolean(data, path)).to.equal(value);
      });
    });

    describe('getAsJsonMap', () => {
      it('should return undefined when passed an empty json map', () => {
        expect(narrowing.getAsJsonMap(undefined, 'foo')).to.be.undefined;
      });

      it('should return undefined when passed an unknown path', () => {
        expect(narrowing.getAsJsonMap(data, 'foo')).to.be.undefined;
      });

      it('should return a default when passed an unknown path and a default', () => {
        const def = { a: 'b', c: 'd' };
        expect(narrowing.getAsJsonMap(data, 'foo', def)).to.equal(def);
      });

      it('should return a JsonMap when passed a path to a JsonMap', () => {
        const value = { a: 'b', c: 'd' };
        const path = 'inner.m';
        expect(narrowing.getAsJsonMap(data, path)).to.deep.equal(value);
      });
    });

    describe('getAsJsonArray', () => {
      it('should return undefined when passed an empty json map', () => {
        expect(narrowing.getAsJsonArray(undefined, 'foo')).to.be.undefined;
      });

      it('should return undefined when passed an unknown path', () => {
        expect(narrowing.getAsJsonArray(data, 'foo')).to.be.undefined;
      });

      it('should return a default when passed an unknown path and a default', () => {
        const def = ['a', 'b'];
        expect(narrowing.getAsJsonArray(data, 'foo', def)).to.equal(def);
      });

      it('should return a JsonArray when passed a path to a JsonArray', () => {
        const value = ['a', 'b'];
        const path = 'inner.a';
        expect(narrowing.getAsJsonArray(data, path)).to.deep.equal(value);
      });
    });
  });

  describe('get ensure type', () => {
    const data: JsonMap = {
      inner: {
        s: 'string',
        n: 1,
        b: true,
        m: { a: 'b', c: 'd' },
        a: ['a', 'b']
      }
    };

    describe('getEnsureAnyJson', () => {
      it('should raise an error when passed an undefined map', () => {
        expect(() => narrowing.getEnsureAnyJson(undefined, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should raise an error when passed an unknown path', () => {
        expect(() => narrowing.getEnsureAnyJson(data, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a string when passed a path to a string', () => {
        const value = 'string';
        const path = 'inner.s';
        expect(narrowing.getEnsureAnyJson(data, path)).to.equal(value);
      });
    });

    describe('getEnsureString', () => {
      it('should raise an error when passed an undefined map', () => {
        expect(() => narrowing.getEnsureString(undefined, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should raise an error when passed an unknown path', () => {
        expect(() => narrowing.getEnsureString(data, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a string when passed a path to a string', () => {
        const value = 'string';
        const path = 'inner.s';
        expect(narrowing.getEnsureString(data, path)).to.equal(value);
      });
    });

    describe('getEnsureNumber', () => {
      it('should raise an error when passed an undefined map', () => {
        expect(() => narrowing.getEnsureNumber(undefined, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should raise an error when passed an unknown path', () => {
        expect(() => narrowing.getEnsureNumber(data, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a number when passed a path to a number', () => {
        const value = 1;
        const path = 'inner.n';
        expect(narrowing.getEnsureNumber(data, path)).to.equal(value);
      });
    });

    describe('getEnsureBoolean', () => {
      it('should raise an error when passed an undefined map', () => {
        expect(() => narrowing.getEnsureBoolean(undefined, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should raise an error when passed an unknown path', () => {
        expect(() => narrowing.getEnsureBoolean(data, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a boolean when passed a path to a boolean', () => {
        const value = true;
        const path = 'inner.b';
        expect(narrowing.getEnsureBoolean(data, path)).to.equal(value);
      });
    });

    describe('getEnsureJsonMap', () => {
      it('should raise an error when passed an undefined map', () => {
        expect(() => narrowing.getEnsureJsonMap(undefined, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should raise an error when passed an unknown path', () => {
        expect(() => narrowing.getEnsureJsonMap(data, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a JsonMap when passed a path to a JsonMap', () => {
        const value = { a: 'b', c: 'd' };
        const path = 'inner.m';
        expect(narrowing.getEnsureJsonMap(data, path)).to.deep.equal(value);
      });
    });

    describe('getEnsureJsonArray', () => {
      it('should raise an error when passed an undefined map', () => {
        expect(() => narrowing.getEnsureJsonArray(undefined, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should raise an error when passed an unknown path', () => {
        expect(() => narrowing.getEnsureJsonArray(data, 'foo')).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a JsonArray when passed a path to a JsonArray', () => {
        const value = ['a', 'b'];
        const path = 'inner.a';
        expect(narrowing.getEnsureJsonArray(data, path)).to.deep.equal(value);
      });
    });
  });

  describe('keysOf', () => {
    it("should allow convenient enumeration of a typed object's keys", () => {
      const acc: Array<[string, number]> = [];
      interface Point {
        x: number;
        y: number;
      }
      const point: Point = { x: 1, y: 2 };
      const keys = narrowing.keysOf(point);
      for (const key of keys) {
        acc.push([key, point[key]]);
      }
      expect(acc).to.deep.equal([['x', 1], ['y', 2]]);
    });
  });

  describe('entriesOf', () => {
    it("should allow convenient enumeration of a typed object's entries", () => {
      const acc: Array<[string, number]> = [];
      interface Point {
        x: number;
        y: number;
      }
      const point: Point = { x: 1, y: 2 };
      const entries = narrowing.entriesOf(point);
      for (const entry of entries) {
        acc.push([entry[0], entry[1]]);
      }
      expect(acc).to.deep.equal([['x', 1], ['y', 2]]);
    });
  });

  describe('valuesOf', () => {
    it("should allow convenient enumeration of a typed object's values", () => {
      const acc: number[] = [];
      interface Point {
        x: number;
        y: number;
      }
      const point: Point = { x: 1, y: 2 };
      const values = narrowing.valuesOf(point);
      for (const value of values) {
        acc.push(value);
      }
      expect(acc).to.deep.equal([1, 2]);
    });
  });

  describe('definite *', () => {
    interface Obj {
      a: string;
      b: Optional<string>;
      c: Nullable<string>;
    }
    const obj: Obj = { a: 'foo', b: undefined, c: null };
    const dict: Dictionary<Nullable<string>> = {
      a: 'foo',
      b: undefined,
      c: null
    };

    describe('definiteEntriesOf', () => {
      it("should allow convenient enumeration of a well-typed object's entries containing definite values", () => {
        const entries = narrowing.definiteEntriesOf(obj); // ['a' | 'b' | 'c', string][]
        expect(entries).to.deep.equal([['a', 'foo']]);
      });

      it("should allow convenient enumeration of a dictionary's entries containing definite values", () => {
        const entries = narrowing.definiteEntriesOf(dict); // [string, string][]
        expect(entries).to.deep.equal([['a', 'foo']]);
      });
    });

    describe('definiteKeysOf', () => {
      it("should allow convenient enumeration of a well-typed object's keys associated with definite values", () => {
        const keys = narrowing.definiteKeysOf(obj); // ('a' | 'b' | 'c')[]
        expect(keys).to.deep.equal(['a']);
      });

      it("should allow convenient enumeration of a dictionary's keys associated with definite values", () => {
        const keys = narrowing.definiteKeysOf(dict); // string[]
        expect(keys).to.deep.equal(['a']);
      });
    });

    describe('definiteValuesOf', () => {
      it("should allow convenient enumeration of a well-typed object's non-nullable values", () => {
        const values = narrowing.definiteValuesOf(obj); // string[]
        expect(values).to.deep.equal(['foo']);
      });

      it("should allow convenient enumeration of a dictionary's non-nullable values", () => {
        const values = narrowing.definiteValuesOf(dict); // string[]
        expect(values).to.deep.equal(['foo']);
      });
    });
  });
});
