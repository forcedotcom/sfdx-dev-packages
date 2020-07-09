/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import {
  isAnyJson,
  isArray,
  isArrayLike,
  isBoolean,
  isClassAssignableTo,
  isFunction,
  isInstance,
  isJsonArray,
  isJsonMap,
  isKeyOf,
  isNumber,
  isObject,
  isPlainObject,
  isString,
} from '../../src/narrowing/is';
import { JsonArray } from '../../src/types';

class TestClass {
  public constructor(public name = 'Test') {}
}

class TestSubclass extends TestClass {
  public constructor(name = 'SubTest') {
    super(name);
  }
}

describe('is type', () => {
  describe('isString', () => {
    it('should return false when passed undefined', () => {
      expect(isString(undefined)).to.be.false;
    });

    it('should return true when passed a string', () => {
      const value = '';
      expect(isString(value)).to.be.true;
    });
  });

  describe('isNumber', () => {
    it('should return false when passed undefined', () => {
      expect(isNumber(undefined)).to.be.false;
    });

    it('should return true when passed a number', () => {
      const value = 0;
      expect(isNumber(value)).to.be.true;
    });
  });

  describe('isBoolean', () => {
    it('should return false when passed undefined', () => {
      expect(isBoolean(undefined)).to.be.false;
    });

    it('should return true when passed a boolean', () => {
      const value = false;
      expect(isBoolean(value)).to.be.true;
    });
  });

  describe('isObject', () => {
    it('should reject undefined', () => {
      expect(isObject(undefined)).to.be.false;
    });

    it('should reject null', () => {
      expect(isObject(null)).to.be.false;
    });

    it('should reject string', () => {
      expect(isObject('string')).to.be.false;
    });

    it('should reject number', () => {
      expect(isObject(1)).to.be.false;
    });

    it('should reject boolean', () => {
      expect(isObject(true)).to.be.false;
    });

    it('should accept array', () => {
      expect(isObject([])).to.be.true;
    });

    it('should accept object', () => {
      expect(isObject({})).to.be.true;
    });

    it('should accept instance of TestClass', () => {
      expect(isObject(new TestClass())).to.be.true;
    });

    it('should accept function', () => {
      expect(isObject(() => {})).to.be.true;
    });

    it('should accept new String()', () => {
      expect(isObject(String('foo'))).to.be.true;
    });

    it('should accept new Number()', () => {
      expect(isObject(Number(0))).to.be.true;
    });

    it('should accept new String()', () => {
      expect(isObject(Boolean(true))).to.be.true;
    });

    it('should accept new RegExp()', () => {
      expect(isObject(new RegExp('foo'))).to.be.true;
    });
  });

  describe('isPlainObject', () => {
    it('should reject undefined', () => {
      expect(isPlainObject(undefined)).to.be.false;
    });

    it('should reject null', () => {
      expect(isPlainObject(null)).to.be.false;
    });

    it('should reject string', () => {
      expect(isPlainObject('string')).to.be.false;
    });

    it('should reject number', () => {
      expect(isPlainObject(1)).to.be.false;
    });

    it('should reject boolean', () => {
      expect(isPlainObject(true)).to.be.false;
    });

    it('should reject array', () => {
      expect(isPlainObject([])).to.be.false;
    });

    it('should accept object', () => {
      expect(isPlainObject({})).to.be.true;
    });

    it('should reject instance of TestClass', () => {
      expect(isPlainObject(new TestClass())).to.be.false;
    });

    it('should reject mock class', () => {
      expect(isPlainObject({ constructor: true })).to.be.false;
      const wtf = () => {};
      wtf.prototype = TestClass;
      expect(isPlainObject({ constructor: wtf })).to.be.false;
    });

    it('should reject function', () => {
      expect(isPlainObject(() => {})).to.be.false;
    });
  });

  describe('isInstance', () => {
    it('should reject undefined', () => {
      expect(isInstance(undefined, TestClass)).to.be.false;
    });

    it('should reject null', () => {
      expect(isInstance(null, TestClass)).to.be.false;
    });

    it('should reject string', () => {
      expect(isInstance('string', TestClass)).to.be.false;
    });

    it('should reject number', () => {
      expect(isInstance(1, TestClass)).to.be.false;
    });

    it('should reject boolean', () => {
      expect(isInstance(true, TestClass)).to.be.false;
    });

    it('should reject array', () => {
      expect(isInstance([], TestClass)).to.be.false;
    });

    it('should reject object', () => {
      expect(isInstance({}, TestClass)).to.be.false;
    });

    it('should accept instance of TestClass', () => {
      expect(isInstance(new TestClass(), TestClass)).to.be.true;
    });

    it('should accept instance of TestSubclass', () => {
      expect(isInstance(new TestSubclass(), TestClass)).to.be.true;
    });

    it('should reject function', () => {
      expect(isInstance(() => {}, TestClass)).to.be.false;
    });
  });

  describe('isType', () => {
    it('should reject undefined', () => {
      expect(isClassAssignableTo(undefined, TestClass)).to.be.false;
    });

    it('should reject null', () => {
      expect(isClassAssignableTo(null, TestClass)).to.be.false;
    });

    it('should reject string', () => {
      expect(isClassAssignableTo('string', TestClass)).to.be.false;
    });

    it('should reject number', () => {
      expect(isClassAssignableTo(1, TestClass)).to.be.false;
    });

    it('should reject boolean', () => {
      expect(isClassAssignableTo(true, TestClass)).to.be.false;
    });

    it('should reject array', () => {
      expect(isClassAssignableTo([], TestClass)).to.be.false;
    });

    it('should reject object', () => {
      expect(isClassAssignableTo({}, TestClass)).to.be.false;
    });

    it('should accept TestClass as TestClass', () => {
      expect(isClassAssignableTo(TestClass, TestClass)).to.be.true;
    });

    it('should accept TestSubclass as TestClass', () => {
      expect(isClassAssignableTo(TestSubclass, TestClass)).to.be.true;
    });

    it('should reject TestClass as TestSubclass', () => {
      expect(isClassAssignableTo(TestClass, TestSubclass)).to.be.false;
    });

    it('should reject function', () => {
      expect(isClassAssignableTo(() => {}, TestClass)).to.be.false;
    });
  });

  describe('isArray', () => {
    it('should reject undefined', () => {
      expect(isArray(undefined)).to.be.false;
    });

    it('should reject null', () => {
      expect(isArray(null)).to.be.false;
    });

    it('should reject string', () => {
      expect(isArray('string')).to.be.false;
    });

    it('should reject number', () => {
      expect(isArray(1)).to.be.false;
    });

    it('should reject boolean', () => {
      expect(isArray(true)).to.be.false;
    });

    it('should accept array', () => {
      expect(isArray([])).to.be.true;
    });

    it('should reject object', () => {
      expect(isArray({})).to.be.false;
    });

    it('should reject instance of TestClass', () => {
      expect(isArray(new TestClass())).to.be.false;
    });

    it('should reject array-like', () => {
      expect(isArray({ length: 1, 0: 'test' })).to.be.false;
    });

    it('should reject function', () => {
      expect(isArray(() => {})).to.be.false;
    });
  });

  describe('isArrayLike', () => {
    it('should reject undefined', () => {
      expect(isArrayLike(undefined)).to.be.false;
    });

    it('should reject null', () => {
      expect(isArrayLike(null)).to.be.false;
    });

    it('should accept string', () => {
      expect(isArrayLike('string')).to.be.true;
    });

    it('should reject number', () => {
      expect(isArrayLike(1)).to.be.false;
    });

    it('should reject boolean', () => {
      expect(isArrayLike(true)).to.be.false;
    });

    it('should accept array', () => {
      expect(isArrayLike([])).to.be.true;
    });

    it('should reject object', () => {
      expect(isArrayLike({})).to.be.false;
    });

    it('should accept array-like', () => {
      expect(isArrayLike({ length: 1, 0: 'test' })).to.be.true;
    });

    it('should reject function', () => {
      expect(isArrayLike(() => {})).to.be.false;
    });
  });

  describe('isFunction', () => {
    it('should reject undefined', () => {
      expect(isFunction(undefined)).to.be.false;
    });

    it('should reject null', () => {
      expect(isFunction(null)).to.be.false;
    });

    it('should reject string', () => {
      expect(isFunction('string')).to.be.false;
    });

    it('should reject number', () => {
      expect(isFunction(1)).to.be.false;
    });

    it('should reject boolean', () => {
      expect(isFunction(true)).to.be.false;
    });

    it('should reject array', () => {
      expect(isFunction([])).to.be.false;
    });

    it('should reject object', () => {
      expect(isFunction({})).to.be.false;
    });

    it('should accept function expressions', () => {
      // eslint-disable-next-line prefer-arrow-callback
      expect(isFunction(function () {})).to.be.true;
    });

    it('should accept arrow functions', () => {
      expect(isFunction(() => {})).to.be.true;
    });
  });

  describe('isAnyJson', () => {
    it('should return false when passed undefined', () => {
      expect(isAnyJson(undefined)).to.be.false;
    });

    it('should return false when passed a function', () => {
      expect(isAnyJson(() => {})).to.be.false;
    });

    it('should return true when passed null', () => {
      const value = null;
      expect(isAnyJson(value)).to.be.true;
    });

    it('should return true when passed a string', () => {
      const value = '';
      expect(isAnyJson(value)).to.be.true;
    });

    it('should return true when passed a number', () => {
      const value = 0;
      expect(isAnyJson(value)).to.be.true;
    });

    it('should return true when passed a boolean', () => {
      const value = false;
      expect(isAnyJson(value)).to.be.true;
    });

    it('should return true when passed a JsonMap', () => {
      const value = {};
      expect(isAnyJson(value)).to.be.true;
    });

    it('should return true when passed a JsonArray', () => {
      const value: JsonArray = [];
      expect(isAnyJson(value)).to.be.true;
    });
  });

  describe('isJsonMap', () => {
    it('should return false when passed undefined', () => {
      expect(isJsonMap(undefined)).to.be.false;
    });

    it('should return true when passed a JsonMap', () => {
      const value = { a: 'b', c: 'd' };
      expect(isJsonMap(value)).to.be.true;
    });
  });

  describe('isJsonArray', () => {
    it('should return false when passed undefined', () => {
      expect(isJsonArray(undefined)).to.be.false;
    });

    it('should return true when passed a JsonArray', () => {
      const value = ['a', 'b'];
      expect(isJsonArray(value)).to.be.true;
    });
  });

  describe('isKeyOf', () => {
    it('should return false when passed a non-key string', () => {
      expect(isKeyOf({ bar: true }, 'foo')).to.be.false;
    });

    it('should return true when passed a key string', () => {
      expect(isKeyOf({ bar: true }, 'bar')).to.be.true;
    });
  });
});
