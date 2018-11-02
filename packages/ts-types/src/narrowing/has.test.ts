/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import {
  has,
  hasArray,
  hasBoolean,
  hasFunction,
  hasInstance,
  hasNumber,
  hasObject,
  hasPlainObject,
  hasString
} from './has';

class TestClass {
  constructor(public name = 'test') {}
}

describe('has type', () => {
  let obj: unknown;

  beforeEach(() => {
    obj = {
      u: undefined,
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

    it('should narrow an unknown type to an object with an function property', () => {
      if (!hasFunction(obj, 'f')) {
        throw new Error('object should have function property f');
      }
      // trivial runtime check but useful for compilation testing
      expect(obj.f).to.equal(obj.f);
    });
  });
});
