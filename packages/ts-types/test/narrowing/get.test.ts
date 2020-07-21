/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import {
  get,
  getAnyJson,
  getArray,
  getBoolean,
  getFunction,
  getInstance,
  getJsonArray,
  getJsonMap,
  getNumber,
  getObject,
  getPlainObject,
  getString,
  getDictionary,
} from '../../src/narrowing/get';

class TestClass {
  public constructor(public name = 'test') {}
}

describe('get type', () => {
  const jsonMap = {
    inner: {
      s: 'string',
      n: 1,
      b: true,
      m: { a: 'b', c: 'd', e: [1] },
      a: ['a', 'b'],
    },
  };

  const jsonArray = [jsonMap];

  const obj = {
    inner: Object.assign(jsonMap.inner, {
      c: new TestClass(),
      f: () => {},
    }),
  };

  describe('get', () => {
    it('should return undefined when passed an undefined object', () => {
      expect(get(undefined, 'foo')).to.be.undefined;
    });

    it('should return undefined when passed a null object', () => {
      expect(get(null, 'foo')).to.be.undefined;
    });

    it('should return undefined when passed an unknown path', () => {
      expect(get(jsonMap, 'foo')).to.be.undefined;
    });

    it('should return a default when passed an unknown path and a default', () => {
      const def = 'def';
      expect(get(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a value from an object when passed a valid object path', () => {
      const value = jsonMap.inner.s;
      const path = 'inner.s';
      expect(get(jsonMap, path)).to.equal(value);
    });

    it('should return a value from an array when passed a valid array path', () => {
      const value = jsonArray[0].inner.a[1];
      const path = '[0].inner.a[1]';
      expect(get(jsonArray, path)).to.equal(value);
    });

    it('should support string keys in brackets, with or without any style of quotes', () => {
      const value = jsonArray[0].inner.m.e[0];
      const path = '[0]["inner"][m][\'e\'][0]';
      expect(get(jsonArray, path)).to.equal(value);
    });
  });

  describe('getString', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = 'def';
      expect(getString(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a string when passed a path to a string', () => {
      const value = jsonMap.inner.s;
      const path = 'inner.s';
      expect(getString(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-string', () => {
      const path = 'inner.b';
      expect(getString(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getNumber', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = 1;
      expect(getNumber(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a number when passed a path to a number', () => {
      const value = jsonMap.inner.n;
      const path = 'inner.n';
      expect(getNumber(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-number', () => {
      const path = 'inner.s';
      expect(getNumber(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getBoolean', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = true;
      expect(getBoolean(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a boolean when passed a path to a boolean', () => {
      const value = jsonMap.inner.b;
      const path = 'inner.b';
      expect(getBoolean(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-boolean', () => {
      const path = 'inner.s';
      expect(getBoolean(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getObject', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = { a: 'b' };
      expect(getObject(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return an object when passed a path to an object', () => {
      const value = jsonMap.inner.m;
      const path = 'inner.m';
      expect(getObject(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-object', () => {
      const path = 'inner.s';
      expect(getObject(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getPlainObject', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = { a: 'b' };
      expect(getPlainObject(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a plain object when passed a path to an object', () => {
      const value = jsonMap.inner.m;
      const path = 'inner.m';
      expect(getPlainObject(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-object', () => {
      const path = 'inner.s';
      expect(getPlainObject(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getDictionary', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = { a: 'b' };
      expect(getDictionary(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a dictionary when passed a path to an object', () => {
      const value = jsonMap.inner.m;
      const path = 'inner.m';
      expect(getDictionary(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-object', () => {
      const path = 'inner.s';
      expect(getDictionary(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getInstance', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = new TestClass('mine');
      expect(getInstance(obj, 'foo', TestClass, def)).to.equal(def);
    });

    it('should return a class instance when passed a path to a class instance', () => {
      const value = obj.inner.c;
      const path = 'inner.c';
      expect(getInstance(obj, path, TestClass)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-instance', () => {
      const path = 'inner.s';
      expect(getInstance(jsonMap, path, TestClass)).to.be.undefined;
    });
  });

  describe('getArray', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = ['a', 'b'];
      expect(getArray(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return an array when passed a path to an array', () => {
      const value = jsonMap.inner.a;
      const path = 'inner.a';
      expect(getArray(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-array', () => {
      const path = 'inner.s';
      expect(getArray(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getFunction', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = () => {};
      expect(getFunction(obj, 'foo', def)).to.equal(def);
    });

    it('should return a class instance when passed a path to a class instance', () => {
      const value = obj.inner.f;
      const path = 'inner.f';
      expect(getFunction(obj, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-function', () => {
      const path = 'inner.s';
      expect(getFunction(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getAnyJson', () => {
    it('should return undefined when passed an unknown path', () => {
      expect(getAnyJson(jsonMap, 'foo')).to.be.undefined;
    });

    it('should return a default when passed an unknown path and a default', () => {
      const def = 'def';
      expect(getAnyJson(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a string when passed a path to a string', () => {
      const value = jsonMap.inner.s;
      const path = 'inner.s';
      expect(getAnyJson(jsonMap, path)).to.equal(value);
    });

    it('should return an array element when passed a path containing an array index', () => {
      const value = jsonMap.inner.a[1];
      const path = '[0].inner.a[1]';
      expect(getAnyJson(jsonArray, path)).to.equal(value);
    });

    it('should return a string when passed a path to a string array index', () => {
      const value = jsonMap.inner.a[1];
      const path = 'inner.a[1]';
      expect(getAnyJson(jsonMap, path)).to.equal(value);
    });

    it('should return an array element when passed a path containing an array index', () => {
      const value = jsonArray[0].inner.a[1];
      const path = '[0].inner.a[1]';
      expect(getAnyJson(jsonArray, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-json value', () => {
      const path = 'inner.f';
      expect(getAnyJson(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getJsonMap', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = { a: 'b', c: 'd' };
      expect(getJsonMap(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a JsonMap when passed a path to a JsonMap', () => {
      const value = jsonMap.inner.m;
      const path = 'inner.m';
      expect(getJsonMap(jsonMap, path)).to.deep.equal(value);
    });

    it('should return undefined when passed a path to a non-JsonMap', () => {
      const path = 'inner.f';
      expect(getJsonMap(jsonMap, path)).to.be.undefined;
    });
  });

  describe('getJsonArray', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = ['a', 'b'];
      expect(getJsonArray(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a JsonArray when passed a path to a JsonArray', () => {
      const value = jsonMap.inner.a;
      const path = 'inner.a';
      expect(getJsonArray(jsonMap, path)).to.deep.equal(value);
    });

    it('should return undefined when passed a path to a non-JsonArray value', () => {
      const path = 'inner.f';
      expect(getJsonArray(jsonMap, path)).to.be.undefined;
    });
  });
});
