/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import {
  take,
  takeAnyJson,
  takeArray,
  takeBoolean,
  takeFunction,
  takeInstance,
  takeJsonArray,
  takeJsonMap,
  takeNumber,
  takeObject,
  takePlainObject,
  takeString
} from './get';

class TestClass {
  constructor(public name = 'test') {}
}

describe('take type', () => {
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
      c: new TestClass(),
      f: () => {}
    })
  };

  describe('take', () => {
    it('should return undefined when passed an undefined object', () => {
      expect(take(undefined, 'foo')).to.be.undefined;
    });

    it('should return undefined when passed a null object', () => {
      expect(take(null, 'foo')).to.be.undefined;
    });

    it('should return undefined when passed an unknown path', () => {
      expect(take(jsonMap, 'foo')).to.be.undefined;
    });

    it('should return a default when passed an unknown path and a default', () => {
      const def = 'def';
      expect(take(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a value from an object when passed a valid object path', () => {
      const value = jsonMap.inner.s;
      const path = 'inner.s';
      expect(take(jsonMap, path)).to.equal(value);
    });

    it('should return a value from an array when passed a valid array path', () => {
      const value = jsonArray[0].inner.a[1];
      const path = '[0].inner.a[1]';
      expect(take(jsonArray, path)).to.equal(value);
    });

    it('should support string keys in brackets, with or without any style of quotes', () => {
      const value = jsonArray[0].inner.m.e[0];
      const path = `[0]["inner"][m]['e'][0]`;
      expect(take(jsonArray, path)).to.equal(value);
    });
  });

  describe('takeString', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = 'def';
      expect(takeString(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a string when passed a path to a string', () => {
      const value = jsonMap.inner.s;
      const path = 'inner.s';
      expect(takeString(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-string', () => {
      const path = 'inner.b';
      expect(takeString(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takeNumber', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = 1;
      expect(takeNumber(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a number when passed a path to a number', () => {
      const value = jsonMap.inner.n;
      const path = 'inner.n';
      expect(takeNumber(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-number', () => {
      const path = 'inner.s';
      expect(takeNumber(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takeBoolean', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = true;
      expect(takeBoolean(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a boolean when passed a path to a boolean', () => {
      const value = jsonMap.inner.b;
      const path = 'inner.b';
      expect(takeBoolean(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-boolean', () => {
      const path = 'inner.s';
      expect(takeBoolean(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takeObject', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = { a: 'b' };
      expect(takeObject(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return an object when passed a path to an object', () => {
      const value = jsonMap.inner.m;
      const path = 'inner.m';
      expect(takeObject(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-object', () => {
      const path = 'inner.s';
      expect(takeObject(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takePlainObject', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = { a: 'b' };
      expect(takePlainObject(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return an object when passed a path to an object', () => {
      const value = jsonMap.inner.m;
      const path = 'inner.m';
      expect(takePlainObject(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-object', () => {
      const path = 'inner.s';
      expect(takePlainObject(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takeInstance', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = new TestClass('mine');
      expect(takeInstance(obj, 'foo', TestClass, def)).to.equal(def);
    });

    it('should return a class instance when passed a path to a class instance', () => {
      const value = obj.inner.c;
      const path = 'inner.c';
      expect(takeInstance(obj, path, TestClass)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-instance', () => {
      const path = 'inner.s';
      expect(takeInstance(jsonMap, path, TestClass)).to.be.undefined;
    });
  });

  describe('takeArray', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = ['a', 'b'];
      expect(takeArray(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return an array when passed a path to an array', () => {
      const value = jsonMap.inner.a;
      const path = 'inner.a';
      expect(takeArray(jsonMap, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-array', () => {
      const path = 'inner.s';
      expect(takeArray(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takeFunction', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = () => {};
      expect(takeFunction(obj, 'foo', def)).to.equal(def);
    });

    it('should return a class instance when passed a path to a class instance', () => {
      const value = obj.inner.f;
      const path = 'inner.f';
      expect(takeFunction(obj, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-function', () => {
      const path = 'inner.s';
      expect(takeFunction(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takeAnyJson', () => {
    it('should return undefined when passed an unknown path', () => {
      expect(takeAnyJson(jsonMap, 'foo')).to.be.undefined;
    });

    it('should return a default when passed an unknown path and a default', () => {
      const def = 'def';
      expect(takeAnyJson(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a string when passed a path to a string', () => {
      const value = jsonMap.inner.s;
      const path = 'inner.s';
      expect(takeAnyJson(jsonMap, path)).to.equal(value);
    });

    it('should return an array element when passed a path containing an array index', () => {
      const value = jsonMap.inner.a[1];
      const path = '[0].inner.a[1]';
      expect(takeAnyJson(jsonArray, path)).to.equal(value);
    });

    it('should return a string when passed a path to a string array index', () => {
      const value = jsonMap.inner.a[1];
      const path = 'inner.a[1]';
      expect(takeAnyJson(jsonMap, path)).to.equal(value);
    });

    it('should return an array element when passed a path containing an array index', () => {
      const value = jsonArray[0].inner.a[1];
      const path = '[0].inner.a[1]';
      expect(takeAnyJson(jsonArray, path)).to.equal(value);
    });

    it('should return undefined when passed a path to a non-json value', () => {
      const path = 'inner.f';
      expect(takeAnyJson(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takeJsonMap', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = { a: 'b', c: 'd' };
      expect(takeJsonMap(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a JsonMap when passed a path to a JsonMap', () => {
      const value = jsonMap.inner.m;
      const path = 'inner.m';
      expect(takeJsonMap(jsonMap, path)).to.deep.equal(value);
    });

    it('should return undefined when passed a path to a non-JsonMap', () => {
      const path = 'inner.f';
      expect(takeJsonMap(jsonMap, path)).to.be.undefined;
    });
  });

  describe('takeJsonArray', () => {
    it('should return a default when passed an unknown path and a default', () => {
      const def = ['a', 'b'];
      expect(takeJsonArray(jsonMap, 'foo', def)).to.equal(def);
    });

    it('should return a JsonArray when passed a path to a JsonArray', () => {
      const value = jsonMap.inner.a;
      const path = 'inner.a';
      expect(takeJsonArray(jsonMap, path)).to.deep.equal(value);
    });

    it('should return undefined when passed a path to a non-JsonArray value', () => {
      const path = 'inner.f';
      expect(takeJsonArray(jsonMap, path)).to.be.undefined;
    });
  });
});
