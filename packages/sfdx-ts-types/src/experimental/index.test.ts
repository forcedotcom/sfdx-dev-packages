/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { as, is, ObjectShape } from '.';
import * as narrowing from '.';

describe('experimental', () => {
  class TestClass {
    public foo = 'bar';
  }

  interface Test {
    s: string;
    b?: boolean;
    c?: TestClass;
  }

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
        const view = narrowing.view(obj, 'z');
        if (view) {
          throw new Error('object should not have property z');
        }
      });

      it('should view an unknown type when the target key is found, even if undefined', () => {
        const view = narrowing.view(obj, 'u');
        if (!view) {
          throw new Error('object should have property u');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.u).to.equal(view.u);
      });

      it('should view an unknown type when the target key is found', () => {
        const view = narrowing.view(obj, 's');
        if (!view) {
          throw new Error('object should have property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.s).to.equal(view.s);
      });

      it('should progressively view an unknown type when target keys are found', () => {
        const view = narrowing.view(obj, 's');
        if (!view) {
          throw new Error('object should have property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.s).to.equal(view.s);
        const view2 = narrowing.view(view, 'b');
        if (!view2) {
          throw new Error('object should have property b');
        }
        // trivial runtime checks but useful for compilation testing
        expect(view2.s).to.equal(view2.s);
        expect(view2.b).to.equal(view2.b);
      });

      it('should view an unknown type when multiple target keys are found', () => {
        const view = narrowing.view(obj, ['s', 'b']);
        if (!view) {
          throw new Error('object should have properties s and b');
        }
        // trivial runtime checks but useful for compilation testing
        expect(view.s).to.equal(view.s);
        expect(view.b).to.equal(view.b);
      });
    });

    describe('viewString', () => {
      it('should not view an unknown type when checking a non-string property', () => {
        if (narrowing.viewString(obj, 'b')) {
          throw new Error('object should not have string property b');
        }
      });

      it('should view an unknown type to an object with a string property', () => {
        const view = narrowing.viewString(obj, 's');
        if (!view) {
          throw new Error('object should have string property s');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.s).to.equal(view.s);
      });

      it('should view an unknown type to an object with a, optional string property', () => {
        const view = narrowing.viewString(obj, 'u');
        if (!view) {
          throw new Error('object should have string property u');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.u).to.equal(view.u);
      });
    });

    describe('viewNumber', () => {
      it('should not view an unknown type when checking a non-number property', () => {
        if (narrowing.viewNumber(obj, 's')) {
          throw new Error('object should not have number property s');
        }
      });

      it('should view an unknown type to an object with a number property', () => {
        const view = narrowing.viewNumber(obj, 'n');
        if (!view) {
          throw new Error('object should have number property n');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.n).to.equal(view.n);
      });
    });

    describe('viewBoolean', () => {
      it('should not view an unknown type when checking a non-boolean property', () => {
        if (narrowing.viewBoolean(obj, 's')) {
          throw new Error('object should not have boolean property s');
        }
      });

      it('should view an unknown type to an object with a boolean property', () => {
        const view = narrowing.viewBoolean(obj, 'b');
        if (!view) {
          throw new Error('object should have boolean property b');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.b).to.equal(view.b);
      });
    });

    describe('viewObject', () => {
      it('should not view an unknown type when checking a non-object property', () => {
        if (narrowing.viewObject(obj, 's')) {
          throw new Error('object should not have object property s');
        }
      });

      it('should view an unknown type to an object with an object property', () => {
        const view = narrowing.viewObject(obj, 'm');
        if (!view) {
          throw new Error('object should have object property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.m).to.equal(view.m);
      });
    });

    describe('viewPlainObject', () => {
      it('should not view an unknown type when checking a non-object property', () => {
        if (narrowing.viewPlainObject(obj, 's')) {
          throw new Error('object should not have object property s');
        }
      });

      it('should view an unknown type to an object with an object property', () => {
        const view = narrowing.viewPlainObject(obj, 'm');
        if (!view) {
          throw new Error('object should have object property m');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.m).to.equal(view.m);
      });
    });

    describe('viewInstance', () => {
      it('should not view an unknown type when checking a non-instance property', () => {
        if (narrowing.viewInstance(obj, 's', TestClass)) {
          throw new Error('object should not have instance property s');
        }
      });

      it('should view an unknown type to an object with an instance property', () => {
        const view = narrowing.viewInstance(obj, 'i', TestClass);
        if (!view) {
          throw new Error('object should have instance property i');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.i).to.equal(view.i);
      });
    });

    describe('viewArray', () => {
      it('should not view an unknown type when checking a non-array property', () => {
        if (narrowing.viewArray(obj, 's')) {
          throw new Error('object should not have array property s');
        }
      });

      it('should view an unknown type to an object with an array property', () => {
        const view = narrowing.viewArray(obj, 'a');
        if (!view) {
          throw new Error('object should have array property n');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.a).to.equal(view.a);
      });
    });

    describe('viewFunction', () => {
      it('should not view an unknown type when checking a non-function property', () => {
        if (narrowing.viewFunction(obj, 's')) {
          throw new Error('object should not have function property s');
        }
      });

      it('should view an unknown type to an object with a function property', () => {
        const view = narrowing.viewFunction(obj, 'f');
        if (!view) {
          throw new Error('object should have object property n');
        }
        // trivial runtime check but useful for compilation testing
        expect(view.f).to.equal(view.f);
      });
    });
  });
});
