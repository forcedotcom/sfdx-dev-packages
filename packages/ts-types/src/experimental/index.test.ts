/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import {
  as,
  is,
  ObjectShape,
  view,
  viewArray,
  viewBoolean,
  viewFunction,
  viewInstance,
  viewNumber,
  viewObject,
  viewPlainObject,
  viewString
} from '.';

class TestClass {
  public foo = 'bar';
}

interface Test {
  s: string;
  b?: boolean;
  c?: TestClass;
}

describe('experimental', () => {
  const testShape: ObjectShape = {
    s: 'string',
    b: {
      type: 'boolean',
      optional: true
    },
    c: {
      type: TestClass,
      optional: true
    }
  };

  describe('is', () => {
    it('should return false if an object conforms to a given shape', () => {
      const o: object = { s: false };
      expect(is<Test>(o, testShape)).to.be.false;
    });

    it('should return true if an object conforms to a given shape', () => {
      const o: object = { s: 'string', b: false, c: new TestClass() };
      expect(is<Test>(o, testShape)).to.be.true;
    });
  });

  describe('as', () => {
    it('should return a typed object if it does not conform to a given shape', () => {
      const o: object = { s: false };
      expect(as<Test>(o, testShape)).to.be.undefined;
    });

    it('should return a typed object if it conforms to a given shape', () => {
      const o: object = { s: 'string', b: false, c: new TestClass() };
      expect(as<Test>(o, testShape)).to.equal(o);
    });
  });

  describe('view', () => {
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

    describe('view (unknown)', () => {
      it('should fail to view an unknown type if the target key does not exist', () => {
        const v = view(obj, 'z');
        if (v) {
          throw new Error('object should not have property z');
        }
      });

      it('should view an unknown type when the target key is found, even if undefined', () => {
        const v = view(obj, 'u');
        if (!v) {
          throw new Error('object should have property u');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.u).to.equal(v.u);
      });

      it('should view an unknown type when the target key is found', () => {
        const v = view(obj, 's');
        if (!v) {
          throw new Error('object should have property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.s).to.equal(v.s);
      });

      it('should progressively view an unknown type when target keys are found', () => {
        const v = view(obj, 's');
        if (!v) {
          throw new Error('object should have property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.s).to.equal(v.s);
        const v2 = view(v, 'b');
        if (!v2) {
          throw new Error('object should have property b');
        }
        // trivial runtime checks but useful for compilation testing
        expect(v2.s).to.equal(v2.s);
        expect(v2.b).to.equal(v2.b);
      });

      it('should view an unknown type when multiple target keys are found', () => {
        const v = view(obj, ['s', 'b']);
        if (!v) {
          throw new Error('object should have properties s and b');
        }
        // trivial runtime checks but useful for compilation testing
        expect(v.s).to.equal(v.s);
        expect(v.b).to.equal(v.b);
      });
    });

    describe('viewString', () => {
      it('should not view an unknown type when checking a non-string property', () => {
        if (viewString(obj, 'b')) {
          throw new Error('object should not have string property b');
        }
      });

      it('should view an unknown type to an object with a string property', () => {
        const v = viewString(obj, 's');
        if (!v) {
          throw new Error('object should have string property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.s).to.equal(v.s);
      });

      it('should view an unknown type to an object with a, optional string property', () => {
        const v = viewString(obj, 'u');
        if (!v) {
          throw new Error('object should have string property u');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.u).to.equal(v.u);
      });
    });

    describe('viewNumber', () => {
      it('should not view an unknown type when checking a non-number property', () => {
        if (viewNumber(obj, 's')) {
          throw new Error('object should not have number property s');
        }
      });

      it('should view an unknown type to an object with a number property', () => {
        const v = viewNumber(obj, 'n');
        if (!v) {
          throw new Error('object should have number property n');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.n).to.equal(v.n);
      });
    });

    describe('viewBoolean', () => {
      it('should not view an unknown type when checking a non-boolean property', () => {
        if (viewBoolean(obj, 's')) {
          throw new Error('object should not have boolean property s');
        }
      });

      it('should view an unknown type to an object with a boolean property', () => {
        const v = viewBoolean(obj, 'b');
        if (!v) {
          throw new Error('object should have boolean property b');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.b).to.equal(v.b);
      });
    });

    describe('viewObject', () => {
      it('should not view an unknown type when checking a non-object property', () => {
        if (viewObject(obj, 's')) {
          throw new Error('object should not have object property s');
        }
      });

      it('should view an unknown type to an object with an object property', () => {
        const v = viewObject(obj, 'm');
        if (!v) {
          throw new Error('object should have object property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.m).to.equal(v.m);
      });
    });

    describe('viewPlainObject', () => {
      it('should not view an unknown type when checking a non-object property', () => {
        if (viewPlainObject(obj, 's')) {
          throw new Error('object should not have object property s');
        }
      });

      it('should view an unknown type to an object with an object property', () => {
        const v = viewPlainObject(obj, 'm');
        if (!v) {
          throw new Error('object should have object property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.m).to.equal(v.m);
      });
    });

    describe('viewInstance', () => {
      it('should not view an unknown type when checking a non-instance property', () => {
        if (viewInstance(obj, 's', TestClass)) {
          throw new Error('object should not have instance property s');
        }
      });

      it('should view an unknown type to an object with an instance property', () => {
        const v = viewInstance(obj, 'i', TestClass);
        if (!v) {
          throw new Error('object should have instance property i');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.i).to.equal(v.i);
      });
    });

    describe('viewArray', () => {
      it('should not view an unknown type when checking a non-array property', () => {
        if (viewArray(obj, 's')) {
          throw new Error('object should not have array property s');
        }
      });

      it('should view an unknown type to an object with an array property', () => {
        const v = viewArray(obj, 'a');
        if (!v) {
          throw new Error('object should have array property n');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.a).to.equal(v.a);
      });
    });

    describe('viewFunction', () => {
      it('should not view an unknown type when checking a non-function property', () => {
        if (viewFunction(obj, 's')) {
          throw new Error('object should not have function property s');
        }
      });

      it('should view an unknown type to an object with a function property', () => {
        const v = viewFunction(obj, 'f');
        if (!v) {
          throw new Error('object should have object property n');
        }
        // trivial runtime check but useful for compilation testing
        expect(v.f).to.equal(v.f);
      });
    });
  });
});
