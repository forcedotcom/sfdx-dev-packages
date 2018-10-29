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
import { Dictionary, JsonArray, Nullable, Optional } from './types';

describe('type narrowing', () => {
  class Test {
    constructor(public name = 'test') {}
  }

  describe('valueOrDefault', () => {
    it('should return undefined when passed an undefined value and an undefined default', () => {
      expect(narrowing.valueOrDefault(undefined, undefined)).to.be.undefined;
    });

    it('should return null when passed a null value and an undefined default', () => {
      expect(narrowing.valueOrDefault(null, undefined)).to.be.null;
    });

    it('should return null when passed an undefined value and a null default', () => {
      expect(narrowing.valueOrDefault(undefined, null)).to.be.null;
    });

    it('should return null when passed a null value and a null default', () => {
      expect(narrowing.valueOrDefault(null, null)).to.be.null;
    });

    it('should return the value when passed a defined value and an undefined default', () => {
      expect(narrowing.valueOrDefault('a', undefined)).to.equal('a');
    });

    it('should return the value when passed a defined value and a null default', () => {
      expect(narrowing.valueOrDefault('a', null)).to.equal('a');
    });

    it('should return the value when passed a defined value and a defined default', () => {
      expect(narrowing.valueOrDefault('a', 'b')).to.equal('a');
    });

    it('should return the default when passed an undefined value and a defined default', () => {
      expect(narrowing.valueOrDefault(undefined, 'b')).to.equal('b');
    });

    it('should return the default when passed a null value and a defined default', () => {
      expect(narrowing.valueOrDefault(null, 'b')).to.equal('b');
    });
  });

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

    describe('isArrayLike', () => {
      it('should reject undefined', () => {
        expect(narrowing.isArrayLike(undefined)).to.be.false;
      });

      it('should reject null', () => {
        expect(narrowing.isArrayLike(null)).to.be.false;
      });

      it('should accept string', () => {
        expect(narrowing.isArrayLike('string')).to.be.true;
      });

      it('should reject number', () => {
        expect(narrowing.isArrayLike(1)).to.be.false;
      });

      it('should reject boolean', () => {
        expect(narrowing.isArrayLike(true)).to.be.false;
      });

      it('should accept array', () => {
        expect(narrowing.isArrayLike([])).to.be.true;
      });

      it('should reject object', () => {
        expect(narrowing.isArrayLike({})).to.be.false;
      });

      it('should accept array-like', () => {
        expect(narrowing.isArrayLike({ length: 1, 0: 'test' })).to.be.true;
      });

      it('should reject function', () => {
        expect(narrowing.isArrayLike(() => {})).to.be.false;
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
        expect(narrowing.isKeyOf({ bar: true }, 'foo')).to.be.false;
      });

      it('should return true when passed a key string', () => {
        expect(narrowing.isKeyOf({ bar: true }, 'bar')).to.be.true;
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

      it('should return a boolean when passed a boolean', () => {
        const value = true;
        expect(narrowing.ensureBoolean(value)).to.equal(value);
      });
    });

    describe('ensureObject', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureObject(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a object when passed a object', () => {
        const value = { a: 'b' };
        expect(narrowing.ensureObject(value)).to.equal(value);
      });
    });

    describe('ensureInstance', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureInstance(undefined, Test)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a class instance when passed a class instance', () => {
        const value = new Test('foo');
        expect(narrowing.ensureInstance(value, Test)).to.equal(value);
      });
    });

    describe('ensureArray', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureArray(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return an array when passed an array', () => {
        const value = ['a', 'b'];
        expect(narrowing.ensureArray(value)).to.equal(value);
      });
    });

    describe('ensureFunction', () => {
      it('should raise an error when passed undefined', () => {
        expect(() => narrowing.ensureFunction(undefined)).to.throw(
          UnexpectedValueTypeError
        );
      });

      it('should return a function when passed a function', () => {
        const value = () => {};
        expect(narrowing.ensureFunction(value)).to.equal(value);
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

  describe('has', () => {
    let obj: unknown;

    beforeEach(() => {
      obj = {
        u: undefined,
        s: '',
        b: false,
        n: 0,
        m: {},
        i: new Test(),
        a: [],
        f: () => {}
      };
    });

    describe('has (unknown)', () => {
      it('should fail to narrow an unknown type if the target key does not exist', () => {
        if (narrowing.has(obj, 'z')) {
          throw new Error('object should not have property z');
        }
      });

      it('should narrow an unknown type when the target key is found, even if undefined', () => {
        if (!narrowing.has(obj, 'u')) {
          throw new Error('object should have property u');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.u).to.equal(obj.u);
      });

      it('should narrow an unknown type when the target key is found', () => {
        if (!narrowing.has(obj, 's')) {
          throw new Error('object should have property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.s).to.equal(obj.s);
      });

      it('should progressively narrow an unknown type when target keys are found', () => {
        if (!narrowing.has(obj, 's')) {
          throw new Error('object should have property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.s).to.equal(obj.s);
        if (!narrowing.has(obj, 'b')) {
          throw new Error('object should have property b');
        }
        // trivial runtime checks but useful for compilation testing
        expect(obj.s).to.equal(obj.s);
        expect(obj.b).to.equal(obj.b);
      });

      it('should narrow an unknown type when multiple target keys are found', () => {
        if (!narrowing.has(obj, ['s', 'b'])) {
          throw new Error('object should have properties s and b');
        }
        // trivial runtime checks but useful for compilation testing
        expect(obj.s).to.equal(obj.s);
        expect(obj.b).to.equal(obj.b);
      });
    });

    describe('hasString', () => {
      it('should not narrow an unknown type when checking a non-string property', () => {
        if (narrowing.hasString(obj, 'b')) {
          throw new Error('object should not have string property b');
        }
      });

      it('should narrow an unknown type to an object with a string property', () => {
        if (!narrowing.hasString(obj, 's')) {
          throw new Error('object should have string property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.s).to.equal(obj.s);
      });
    });

    describe('hasNumber', () => {
      it('should not narrow an unknown type when checking a non-number property', () => {
        if (narrowing.hasNumber(obj, 's')) {
          throw new Error('object should not have number property s');
        }
      });

      it('should narrow an unknown type to an object with a string property', () => {
        if (!narrowing.hasNumber(obj, 'n')) {
          throw new Error('object should have number property n');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.n).to.equal(obj.n);
      });
    });

    describe('hasBoolean', () => {
      it('should not narrow an unknown type when checking a non-string property', () => {
        if (narrowing.hasBoolean(obj, 's')) {
          throw new Error('object should not have boolean property s');
        }
      });

      it('should narrow an unknown type to an object with a string property', () => {
        if (!narrowing.hasBoolean(obj, 'b')) {
          throw new Error('object should have boolean property b');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.b).to.equal(obj.b);
      });
    });

    describe('hasObject', () => {
      it('should not narrow an unknown type when checking a non-object property', () => {
        if (narrowing.hasObject(obj, 's')) {
          throw new Error('object should not have object property s');
        }
      });

      it('should narrow an unknown type to an object with an object property', () => {
        if (!narrowing.hasObject(obj, 'm')) {
          throw new Error('object should have object property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.m).to.deep.equal(obj.m);
      });
    });

    describe('hasPlainObject', () => {
      it('should not narrow an unknown type when checking a non-object property', () => {
        if (narrowing.hasPlainObject(obj, 's')) {
          throw new Error('object should not have object property s');
        }
      });

      it('should narrow an unknown type to an object with an object property', () => {
        if (!narrowing.hasPlainObject(obj, 'm')) {
          throw new Error('object should have object property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.m).to.deep.equal(obj.m);
      });
    });

    describe('hasInstance', () => {
      it('should not narrow an unknown type when checking a non-instance property', () => {
        if (narrowing.hasInstance(obj, 's', Test)) {
          throw new Error('object should not have instance property s');
        }
      });

      it('should narrow an unknown type to an object with an instance property', () => {
        if (!narrowing.hasInstance(obj, 'i', Test)) {
          throw new Error('object should have instance property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.i).to.equal(obj.i);
      });
    });

    describe('hasArray', () => {
      it('should not narrow an unknown type when checking a non-array property', () => {
        if (narrowing.hasArray(obj, 's')) {
          throw new Error('object should not have array property s');
        }
      });

      it('should narrow an unknown type to an object with an array property', () => {
        if (!narrowing.hasArray(obj, 'a')) {
          throw new Error('object should have array property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.a).to.equal(obj.a);
      });
    });

    describe('hasFunction', () => {
      it('should not narrow an unknown type when checking a non-function property', () => {
        if (narrowing.hasFunction(obj, 's')) {
          throw new Error('object should not have function property s');
        }
      });

      it('should narrow an unknown type to an object with an function property', () => {
        if (!narrowing.hasFunction(obj, 'f')) {
          throw new Error('object should have function property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(obj.f).to.equal(obj.f);
      });
    });
  });

  describe('take', () => {
    const jsonMap = {
      inner: {
        s: 'string',
        n: 1,
        b: true,
        m: { a: 'b', c: 'd', e: [1] },
        a: ['a', 'b']
      }
    };

    const jsonArray = [jsonMap];

    const obj = {
      inner: Object.assign(jsonMap.inner, {
        c: new Test(),
        f: () => {}
      })
    };

    describe('take (unknown)', () => {
      it('should return undefined when passed an undefined object', () => {
        expect(narrowing.take(undefined, 'foo')).to.be.undefined;
      });

      it('should return undefined when passed a null object', () => {
        expect(narrowing.take(null, 'foo')).to.be.undefined;
      });

      it('should return undefined when passed an unknown path', () => {
        expect(narrowing.take(jsonMap, 'foo')).to.be.undefined;
      });

      it('should return a default when passed an unknown path and a default', () => {
        const def = 'def';
        expect(narrowing.take(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return a value from an object when passed a valid object path', () => {
        const value = jsonMap.inner.s;
        const path = 'inner.s';
        expect(narrowing.take(jsonMap, path)).to.equal(value);
      });

      it('should return a value from an array when passed a valid array path', () => {
        const value = jsonArray[0].inner.a[1];
        const path = '[0].inner.a[1]';
        expect(narrowing.take(jsonArray, path)).to.equal(value);
      });

      it('should support string keys in brackets, with or without any style of quotes', () => {
        const value = jsonArray[0].inner.m.e[0];
        const path = `[0]["inner"][m]['e'][0]`;
        expect(narrowing.take(jsonArray, path)).to.equal(value);
      });
    });

    describe('takeString', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = 'def';
        expect(narrowing.takeString(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return a string when passed a path to a string', () => {
        const value = jsonMap.inner.s;
        const path = 'inner.s';
        expect(narrowing.takeString(jsonMap, path)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-string', () => {
        const path = 'inner.b';
        expect(narrowing.takeString(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takeNumber', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = 1;
        expect(narrowing.takeNumber(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return a number when passed a path to a number', () => {
        const value = jsonMap.inner.n;
        const path = 'inner.n';
        expect(narrowing.takeNumber(jsonMap, path)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-number', () => {
        const path = 'inner.s';
        expect(narrowing.takeNumber(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takeBoolean', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = true;
        expect(narrowing.takeBoolean(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return a boolean when passed a path to a boolean', () => {
        const value = jsonMap.inner.b;
        const path = 'inner.b';
        expect(narrowing.takeBoolean(jsonMap, path)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-boolean', () => {
        const path = 'inner.s';
        expect(narrowing.takeBoolean(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takeObject', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = { a: 'b' };
        expect(narrowing.takeObject(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return an object when passed a path to an object', () => {
        const value = jsonMap.inner.m;
        const path = 'inner.m';
        expect(narrowing.takeObject(jsonMap, path)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-object', () => {
        const path = 'inner.s';
        expect(narrowing.takeObject(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takePlainObject', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = { a: 'b' };
        expect(narrowing.takePlainObject(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return an object when passed a path to an object', () => {
        const value = jsonMap.inner.m;
        const path = 'inner.m';
        expect(narrowing.takePlainObject(jsonMap, path)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-object', () => {
        const path = 'inner.s';
        expect(narrowing.takePlainObject(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takeInstance', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = new Test('mine');
        expect(narrowing.takeInstance(obj, 'foo', Test, def)).to.equal(def);
      });

      it('should return a class instance when passed a path to a class instance', () => {
        const value = obj.inner.c;
        const path = 'inner.c';
        expect(narrowing.takeInstance(obj, path, Test)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-instance', () => {
        const path = 'inner.s';
        expect(narrowing.takeInstance(jsonMap, path, Test)).to.be.undefined;
      });
    });

    describe('takeArray', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = ['a', 'b'];
        expect(narrowing.takeArray(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return an array when passed a path to an array', () => {
        const value = jsonMap.inner.a;
        const path = 'inner.a';
        expect(narrowing.takeArray(jsonMap, path)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-array', () => {
        const path = 'inner.s';
        expect(narrowing.takeArray(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takeFunction', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = () => {};
        expect(narrowing.takeFunction(obj, 'foo', def)).to.equal(def);
      });

      it('should return a class instance when passed a path to a class instance', () => {
        const value = obj.inner.f;
        const path = 'inner.f';
        expect(narrowing.takeFunction(obj, path)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-function', () => {
        const path = 'inner.s';
        expect(narrowing.takeFunction(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takeAnyJson', () => {
      it('should return undefined when passed an unknown path', () => {
        expect(narrowing.takeAnyJson(jsonMap, 'foo')).to.be.undefined;
      });

      it('should return a default when passed an unknown path and a default', () => {
        const def = 'def';
        expect(narrowing.takeAnyJson(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return a string when passed a path to a string', () => {
        const value = jsonMap.inner.s;
        const path = 'inner.s';
        expect(narrowing.takeAnyJson(jsonMap, path)).to.equal(value);
      });

      it('should return an array element when passed a path containing an array index', () => {
        const value = jsonMap.inner.a[1];
        const path = '[0].inner.a[1]';
        expect(narrowing.takeAnyJson(jsonArray, path)).to.equal(value);
      });

      it('should return a string when passed a path to a string array index', () => {
        const value = jsonMap.inner.a[1];
        const path = 'inner.a[1]';
        expect(narrowing.takeAnyJson(jsonMap, path)).to.equal(value);
      });

      it('should return an array element when passed a path containing an array index', () => {
        const value = jsonArray[0].inner.a[1];
        const path = '[0].inner.a[1]';
        expect(narrowing.takeAnyJson(jsonArray, path)).to.equal(value);
      });

      it('should return undefined when passed a path to a non-json value', () => {
        const path = 'inner.f';
        expect(narrowing.takeAnyJson(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takeJsonMap', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = { a: 'b', c: 'd' };
        expect(narrowing.takeJsonMap(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return a JsonMap when passed a path to a JsonMap', () => {
        const value = jsonMap.inner.m;
        const path = 'inner.m';
        expect(narrowing.takeJsonMap(jsonMap, path)).to.deep.equal(value);
      });

      it('should return undefined when passed a path to a non-JsonMap', () => {
        const path = 'inner.f';
        expect(narrowing.takeJsonMap(jsonMap, path)).to.be.undefined;
      });
    });

    describe('takeJsonArray', () => {
      it('should return a default when passed an unknown path and a default', () => {
        const def = ['a', 'b'];
        expect(narrowing.takeJsonArray(jsonMap, 'foo', def)).to.equal(def);
      });

      it('should return a JsonArray when passed a path to a JsonArray', () => {
        const value = jsonMap.inner.a;
        const path = 'inner.a';
        expect(narrowing.takeJsonArray(jsonMap, path)).to.deep.equal(value);
      });

      it('should return undefined when passed a path to a non-JsonArray value', () => {
        const path = 'inner.f';
        expect(narrowing.takeJsonArray(jsonMap, path)).to.be.undefined;
      });
    });
  });

  describe('keysOf', () => {
    it('should return an empty array if passed an undefined object', () => {
      expect(narrowing.keysOf(undefined)).to.deep.equal([]);
    });

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
    it('should return an empty array if passed an undefined object', () => {
      expect(narrowing.entriesOf(undefined)).to.deep.equal([]);
    });

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
    it('should return an empty array if passed an undefined object', () => {
      expect(narrowing.valuesOf(undefined)).to.deep.equal([]);
    });

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
