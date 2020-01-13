/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { AssertionFailedError } from '../../src/errors';
import {
  assert,
  assertAnyJson,
  assertArray,
  assertBoolean,
  assertDictionary,
  assertFunction,
  assertInstance,
  assertJsonArray,
  assertJsonMap,
  assertNonNull,
  assertNumber,
  assertObject,
  assertPlainObject,
  assertString
} from '../../src/narrowing/assert';

class TestClass {
  constructor(public name = 'test') {}
}

describe('assert type', () => {
  describe('assert', () => {
    it('should do nothing when passed true', () => {
      assert(true);
    });

    it('should raise an error when passed false', () => {
      expect(() => assert(false)).to.throw(AssertionFailedError);
    });
  });

  describe('assertNonNull', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertNonNull(undefined)).to.throw(AssertionFailedError);
    });

    it('should raise an error when passed null', () => {
      expect(() => assertNonNull(null)).to.throw(AssertionFailedError);
    });

    it('should do nothing given a non-nullish value', () => {
      const value = 'string';
      assertNonNull(value);
    });
  });

  describe('assertString', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertString(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a string', () => {
      const value = 'string';
      assertString(value);
    });
  });

  describe('assertNumber', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertNumber(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a number', () => {
      const value = 0;
      assertNumber(value);
    });
  });

  describe('assertBoolean', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertBoolean(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a boolean', () => {
      const value = true;
      assertBoolean(value);
    });
  });

  describe('assertObject', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertObject(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a object', () => {
      const value = { a: 'b' };
      assertObject(value);
    });
  });

  describe('assertPlainObject', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertPlainObject(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a plain object', () => {
      const value = { a: 'b' };
      assertPlainObject(value);
    });
  });

  describe('assertDictionary', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertDictionary(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a dictionary object', () => {
      const value = { a: 'b' };
      assertDictionary(value);
    });
  });

  describe('assertInstance', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertInstance(undefined, TestClass)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a class instance', () => {
      const value = new TestClass('foo');
      assertInstance(value, TestClass);
    });
  });

  describe('assertArray', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertArray(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed an array', () => {
      const value = ['a', 'b'];
      assertArray(value);
    });
  });

  describe('assertFunction', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertFunction(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a function', () => {
      const value = () => {};
      assertFunction(value);
    });
  });

  describe('assertAnyJson', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertAnyJson(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a string', () => {
      const value = 'string';
      assertAnyJson(value);
    });
  });

  describe('assertJsonMap', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertJsonMap(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a JsonMap', () => {
      const value = { a: 'b', c: 'd' };
      assertJsonMap(value);
    });
  });

  describe('assertJsonArray', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => assertJsonArray(undefined)).to.throw(AssertionFailedError);
    });

    it('should do nothing when passed a JsonArray', () => {
      const value = ['a', 'b'];
      assertJsonArray(value);
    });
  });
});
