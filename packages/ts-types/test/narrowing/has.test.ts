/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { isAnyJson } from '../../src/narrowing';
import {
  has,
  hasAnyJson,
  hasArray,
  hasBoolean,
  hasFunction,
  hasInstance,
  hasJsonArray,
  hasJsonMap,
  hasNumber,
  hasObject,
  hasPlainObject,
  hasString
} from '../../src/narrowing/has';

class TestClass {
  constructor(public name = 'test') {}
}

describe('has type', () => {
  let obj: unknown;

  beforeEach(() => {
    obj = {
      u: undefined,
      l: null,
      s: '',
      b: false,
      n: 0,
      m: {},
      i: new TestClass(),
      a: [],
      f: () => {}
    };
  });

  describe('has', () => {
    it('should fail to narrow an unknown type if the target key does not exist', () => {
      if (has(obj, 'z')) {
        throw new Error('object should not have property z');
      }
    });

    it('should narrow an unknown type when the target key is found, even if undefined', () => {
      if (!has(obj, 'u')) {
        throw new Error('object should have property u');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.u).to.equal(obj.u);
    });

    it('should narrow an unknown type when the target key is found', () => {
      if (!has(obj, 's')) {
        throw new Error('object should have property s');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.s).to.equal(obj.s);
    });

    it('should progressively narrow an unknown type when target keys are found', () => {
      if (!has(obj, 's')) {
        throw new Error('object should have property s');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.s).to.equal(obj.s);
      if (!has(obj, 'b')) {
        throw new Error('object should have property b');
      }
      // trivial runtime checks but useful for compilation testing
      expect(obj.s).to.equal(obj.s);
      expect(obj.b).to.equal(obj.b);
    });

    it('should narrow an unknown type when multiple target keys are found', () => {
      if (!has(obj, ['s', 'b'])) {
        throw new Error('object should have properties s and b');
      }
      // trivial runtime checks but useful for compilation testing
      expect(obj.s).to.equal(obj.s);
      expect(obj.b).to.equal(obj.b);
    });
  });

  describe('hasString', () => {
    it('should not narrow an unknown type when checking a non-string property', () => {
      if (hasString(obj, 'b')) {
        throw new Error('object should not have string property b');
      }
    });

    it('should narrow an unknown type to an object with a string property', () => {
      if (!hasString(obj, 's')) {
        throw new Error('object should have string property s');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.s).to.equal(obj.s);
    });
  });

  describe('hasNumber', () => {
    it('should not narrow an unknown type when checking a non-number property', () => {
      if (hasNumber(obj, 's')) {
        throw new Error('object should not have number property s');
      }
    });

    it('should narrow an unknown type to an object with a string property', () => {
      if (!hasNumber(obj, 'n')) {
        throw new Error('object should have number property n');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.n).to.equal(obj.n);
    });
  });

  describe('hasBoolean', () => {
    it('should not narrow an unknown type when checking a non-string property', () => {
      if (hasBoolean(obj, 's')) {
        throw new Error('object should not have boolean property s');
      }
    });

    it('should narrow an unknown type to an object with a string property', () => {
      if (!hasBoolean(obj, 'b')) {
        throw new Error('object should have boolean property b');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.b).to.equal(obj.b);
    });
  });

  describe('hasObject', () => {
    it('should not narrow an unknown type when checking a non-object property', () => {
      if (hasObject(obj, 's')) {
        throw new Error('object should not have object property s');
      }
    });

    it('should narrow an unknown type to an object with an object property', () => {
      if (!hasObject(obj, 'm')) {
        throw new Error('object should have object property m');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.m).to.deep.equal(obj.m);
    });
  });

  describe('hasPlainObject', () => {
    it('should not narrow an unknown type when checking a non-object property', () => {
      if (hasPlainObject(obj, 's')) {
        throw new Error('object should not have object property s');
      }
    });

    it('should narrow an unknown type to an object with an object property', () => {
      if (!hasPlainObject(obj, 'm')) {
        throw new Error('object should have object property m');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.m).to.deep.equal(obj.m);
    });
  });

  describe('hasInstance', () => {
    it('should not narrow an unknown type when checking a non-instance property', () => {
      if (hasInstance(obj, 's', TestClass)) {
        throw new Error('object should not have instance property s');
      }
    });

    it('should narrow an unknown type to an object with an instance property', () => {
      if (!hasInstance(obj, 'i', TestClass)) {
        throw new Error('object should have instance property i');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.i).to.equal(obj.i);
    });
  });

  describe('hasArray', () => {
    it('should not narrow an unknown type when checking a non-array property', () => {
      if (hasArray(obj, 's')) {
        throw new Error('object should not have array property s');
      }
    });

    it('should narrow an unknown type to an object with an array property', () => {
      if (!hasArray(obj, 'a')) {
        throw new Error('object should have array property a');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.a).to.equal(obj.a);
    });
  });

  describe('hasFunction', () => {
    it('should not narrow an unknown type when checking a non-function property', () => {
      if (hasFunction(obj, 's')) {
        throw new Error('object should not have function property s');
      }
    });

    it('should narrow an unknown type to an object with a function property', () => {
      if (!hasFunction(obj, 'f')) {
        throw new Error('object should have function property f');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.f).to.equal(obj.f);
    });
  });

  describe('hasAnyJson', () => {
    it('should not narrow an unknown type when checking a non-AnyJson property', () => {
      if (hasAnyJson(obj, 'f')) {
        throw new Error('object should not have AnyJson property f');
      }
    });

    it('should narrow an unknown type to an object with an AnyJson property with a null value', () => {
      if (!hasAnyJson(obj, 'l')) {
        throw new Error('object should have AnyJson property l');
      }
      expect(obj.l).to.equal(null);
    });

    it('should narrow an unknown type to an object with an AnyJson property with a string value', () => {
      if (!hasAnyJson(obj, 's')) {
        throw new Error('object should have AnyJson property s');
      }
      expect(obj.s).to.equal('');
    });

    it('should narrow an unknown type to an object with an AnyJson property with a number value', () => {
      if (!hasAnyJson(obj, 'n')) {
        throw new Error('object should have AnyJson property n');
      }
      expect(obj.n).to.equal(0);
    });

    it('should narrow an unknown type to an object with an AnyJson property with a boolean value', () => {
      if (!hasAnyJson(obj, 'b')) {
        throw new Error('object should have AnyJson property b');
      }
      expect(obj.b).to.equal(false);
    });

    it('should narrow an unknown type to an object with an AnyJson with an object value', () => {
      if (!hasAnyJson(obj, 'm')) {
        throw new Error('object should have AnyJson property m');
      }
      expect(obj.m).to.deep.equal({});
    });

    it('should narrow an unknown type to an object with an AnyJson property with an array value', () => {
      if (!hasAnyJson(obj, 'a')) {
        throw new Error('object should have AnyJson property a');
      }
      expect(obj.a).to.deep.equal([]);
    });
  });

  describe('hasJsonMap', () => {
    it('should not narrow an unknown type when checking a non-JsonMap property', () => {
      if (!isAnyJson(obj)) {
        throw new Error('object must be narrowable to AnyJson');
      }
      if (hasJsonMap(obj, 'f')) {
        throw new Error('object should not have JsonMap property f');
      }
    });

    it('should narrow an unknown type to an object with a JsonMap property', () => {
      if (!isAnyJson(obj)) {
        throw new Error('object must be narrowable to AnyJson');
      }
      if (!hasJsonMap(obj, 'm')) {
        throw new Error('object should have JsonMap property m');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.m).to.equal(obj.m);
    });
  });

  describe('hasJsonArray', () => {
    it('should not narrow an unknown type when checking a non-JsonArray property', () => {
      if (!isAnyJson(obj)) {
        throw new Error('object must be narrowable to AnyJson');
      }
      if (hasJsonArray(obj, 'f')) {
        throw new Error('object should not have JsonArray property f');
      }
    });

    it('should narrow an unknown type to an object with a JsonArray property', () => {
      if (!isAnyJson(obj)) {
        throw new Error('object must be narrowable to AnyJson');
      }
      if (!hasJsonArray(obj, 'a')) {
        throw new Error('object should have JsonArray property a');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.a).to.equal(obj.a);
    });
  });
});
