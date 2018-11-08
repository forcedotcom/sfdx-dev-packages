/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { UnexpectedValueTypeError } from '../../src/errors';
import {
  ensure,
  ensureAnyJson,
  ensureArray,
  ensureBoolean,
  ensureFunction,
  ensureInstance,
  ensureJsonArray,
  ensureJsonMap,
  ensureNumber,
  ensureObject,
  ensurePlainObject,
  ensureString
} from '../../src/narrowing/ensure';

class TestClass {
  constructor(public name = 'test') {}
}

describe('ensure type', () => {
  describe('ensure', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensure(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should raise an error when passed null', () => {
      expect(() => ensure(null)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a string when passed a string', () => {
      const value = 'string';
      expect(ensure(value)).to.equal(value);
    });
  });

  describe('ensureString', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureString(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a string when passed a string', () => {
      const value = 'string';
      expect(ensureString(value)).to.equal(value);
    });
  });

  describe('ensureNumber', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureNumber(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a number when passed a number', () => {
      const value = 1;
      expect(ensureNumber(value)).to.equal(value);
    });
  });

  describe('ensureBoolean', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureBoolean(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a boolean when passed a boolean', () => {
      const value = true;
      expect(ensureBoolean(value)).to.equal(value);
    });
  });

  describe('ensureObject', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureObject(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a object when passed a object', () => {
      const value = { a: 'b' };
      expect(ensureObject(value)).to.equal(value);
    });
  });

  describe('ensurePlainObject', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensurePlainObject(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a object when passed a object', () => {
      const value = { a: 'b' };
      expect(ensurePlainObject(value)).to.equal(value);
    });
  });

  describe('ensureInstance', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureInstance(undefined, TestClass)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a class instance when passed a class instance', () => {
      const value = new TestClass('foo');
      expect(ensureInstance(value, TestClass)).to.equal(value);
    });
  });

  describe('ensureArray', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureArray(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return an array when passed an array', () => {
      const value = ['a', 'b'];
      expect(ensureArray(value)).to.equal(value);
    });
  });

  describe('ensureFunction', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureFunction(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a function when passed a function', () => {
      const value = () => {};
      expect(ensureFunction(value)).to.equal(value);
    });
  });

  describe('ensureAnyJson', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureAnyJson(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a string when passed a string', () => {
      const value = 'string';
      expect(ensureAnyJson(value)).to.equal(value);
    });
  });

  describe('ensureJsonMap', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureJsonMap(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a JsonMap when passed a JsonMap', () => {
      const value = { a: 'b', c: 'd' };
      expect(ensureJsonMap(value)).to.deep.equal(value);
    });
  });

  describe('ensureJsonArray', () => {
    it('should raise an error when passed undefined', () => {
      expect(() => ensureJsonArray(undefined)).to.throw(UnexpectedValueTypeError);
    });

    it('should return a JsonArray when passed a JsonArray', () => {
      const value = ['a', 'b'];
      expect(ensureJsonArray(value)).to.deep.equal(value);
    });
  });
});
