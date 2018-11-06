/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import * as sinon from 'sinon';
import * as _ from '../../src/nodash';

describe('nodash', () => {
  describe('defaults', () => {
    it('should assign defaults', async () => {
      const result = _.defaults({ a: 1 }, { b: 2 }, { a: 3 });
      expect(result).to.deep.equal({ a: 1, b: 2 });
    });
  });

  describe('findKey', () => {
    it('should find keys in various ways', async () => {
      const users = {
        barney: { age: 36, active: true },
        fred: { age: 40, active: false },
        pebbles: { age: 1, active: true }
      };

      let result = _.findKey(users, o => o.age < 40);
      expect(result).to.equal('barney');

      result = _.findKey(users, { age: 1, active: true });
      expect(result).to.equal('pebbles');

      result = _.findKey(users, ['active', false]);
      expect(result).to.equal('fred');

      result = _.findKey(users, 'active');
      expect(result).to.equal('barney');
    });
  });

  describe('includes', () => {
    it('should ', () => {
      expect(_.includes([1, 2, 3], 1)).to.be.true;
      expect(_.includes([1, 2, 3], 1, 2)).to.be.false;
      expect(_.includes({ a: 1, b: 2 }, 1)).to.be.true;
      expect(_.includes('abcd', 'bc')).to.be.true;
    });
  });

  describe('keyBy', () => {
    it('should generate an object from keys of an array of objects', async () => {
      const array = [{ dir: 'left', code: 97 }, { dir: 'right', code: 100 }];
      const result = _.keyBy(array, o => String.fromCharCode(o.code));
      expect(result).to.deep.equal({
        a: { dir: 'left', code: 97 },
        d: { dir: 'right', code: 100 }
      });
    });
  });

  describe('mapKeys', () => {
    it('should map the keys of an object', async () => {
      const obj = { a: 1, b: 2 };
      const result = _.mapKeys(obj, (value, key) => key + value);
      expect(result).to.deep.equal({ a1: 1, b2: 2 });
    });
  });

  describe('minBy', () => {
    it('should find objects by min values in various ways', async () => {
      const objects = [{ n: 1 }, { n: 2 }];

      let result = _.minBy(objects, o => o.n);
      expect(result).to.deep.equal({ n: 1 });

      result = _.minBy(objects, 'n');
      expect(result).to.deep.equal({ n: 1 });
    });
  });

  describe('maxBy', () => {
    it('should find objects by max values in various ways', async () => {
      const objects = [{ n: 1 }, { n: 2 }];

      let result = _.maxBy(objects, o => o.n);
      expect(result).to.deep.equal({ n: 2 });

      result = _.maxBy(objects, 'n');
      expect(result).to.deep.equal({ n: 2 });
    });
  });

  describe('merge', () => {
    it('should recursively merge objects', async () => {
      const users = {
        data: [{ user: 'barney' }, { user: 'fred' }]
      };

      const ages = {
        data: [{ age: 36 }, { age: 40 }]
      };

      const result = _.merge(users, ages);
      expect(result).to.deep.equal({
        data: [{ user: 'barney', age: 36 }, { user: 'fred', age: 40 }]
      });
    });
  });

  describe('omit', () => {
    it('should omit properties of an object', async () => {
      const object = { a: 1, b: 2, c: 3 };

      const result = _.omit(object, ['a', 'c']);
      expect(result).to.deep.equal({ b: 2 });
    });
  });

  describe('once', () => {
    it('should ', async () => {
      const doInit = sinon.spy();
      const initialize = _.once(doInit);
      initialize();
      initialize();
      expect(doInit.calledOnce).to.be.true;
    });
  });

  describe('set', () => {
    it('should set values on an object in various ways', async () => {
      const obj = { a: [{ b: { c: 3 } }] };

      const result1 = _.set(obj, 'a[0].b.c', 4);
      expect(result1).to.deep.equal({ a: [{ b: { c: 4 } }] });

      type NewType = typeof obj & { x: [{ y: { z: number } }] };
      const result2 = _.set<NewType>(obj, 'x[0].y.z', 5);
      expect(result2).to.deep.equal({
        a: [{ b: { c: 4 } }],
        x: [{ y: { z: 5 } }]
      });
    });
  });

  describe('sortBy', () => {
    it('should sort an objects keys and values in various ways', async () => {
      const users = [
        { user: 'fred', age: 48 },
        { user: 'barney', age: 36 },
        { user: 'fred', age: 42 },
        { user: 'barney', age: 34 }
      ];

      let result = _.sortBy(users, o => o.user);
      expect(result).to.deep.equal([
        { user: 'barney', age: 36 },
        { user: 'barney', age: 34 },
        { user: 'fred', age: 48 },
        { user: 'fred', age: 42 }
      ]);

      result = _.sortBy(users, ['user', 'age']);
      expect(result).to.deep.equal([
        { user: 'barney', age: 34 },
        { user: 'barney', age: 36 },
        { user: 'fred', age: 42 },
        { user: 'fred', age: 48 }
      ]);

      result = _.sortBy(users, 'user', o => Math.floor(o.age / 10));
      expect(result).to.deep.equal([
        { user: 'barney', age: 36 },
        { user: 'barney', age: 34 },
        { user: 'fred', age: 48 },
        { user: 'fred', age: 42 }
      ]);
    });
  });

  describe('toNumber', () => {
    it('should handle numbers', () => {
      expect(_.toNumber(3)).to.equal(3);
    });

    it('should handle number constants', () => {
      expect(_.toNumber(Number.MIN_VALUE)).to.equal(Number.MIN_VALUE);
    });

    it('should parse infinity', () => {
      expect(_.toNumber('Infinity')).to.equal(Infinity);
    });

    it('should parse integers', () => {
      expect(_.toNumber('3')).to.equal(3);
    });

    it('should parse floats', () => {
      expect(_.toNumber('3.2')).to.equal(3.2);
    });
  });
});
