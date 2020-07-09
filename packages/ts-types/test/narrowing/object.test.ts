/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import {
  definiteEntriesOf,
  definiteKeysOf,
  definiteValuesOf,
  entriesOf,
  keysOf,
  valuesOf,
} from '../../src/narrowing/object';
import { Dictionary, Nullable, Optional } from '../../src/types';

describe('object', () => {
  describe('keysOf', () => {
    it('should return an empty array if passed an undefined object', () => {
      expect(keysOf(undefined)).to.deep.equal([]);
    });

    it("should allow convenient enumeration of a typed object's keys", () => {
      const acc: Array<[string, number]> = [];
      interface Point {
        x: number;
        y: number;
      }
      const point: Point = { x: 1, y: 2 };
      const keys = keysOf(point);
      for (const key of keys) {
        acc.push([key, point[key]]);
      }
      expect(acc).to.deep.equal([
        ['x', 1],
        ['y', 2],
      ]);
    });
  });

  describe('entriesOf', () => {
    it('should return an empty array if passed an undefined object', () => {
      expect(entriesOf(undefined)).to.deep.equal([]);
    });

    it("should allow convenient enumeration of a typed object's entries", () => {
      const acc: Array<[string, number]> = [];
      interface Point {
        x: number;
        y: number;
      }
      const point: Point = { x: 1, y: 2 };
      const entries = entriesOf(point);
      for (const entry of entries) {
        acc.push([entry[0], entry[1]]);
      }
      expect(acc).to.deep.equal([
        ['x', 1],
        ['y', 2],
      ]);
    });
  });

  describe('valuesOf', () => {
    it('should return an empty array if passed an undefined object', () => {
      expect(valuesOf(undefined)).to.deep.equal([]);
    });

    it("should allow convenient enumeration of a typed object's values", () => {
      const acc: number[] = [];
      interface Point {
        x: number;
        y: number;
      }
      const point: Point = { x: 1, y: 2 };
      const values = valuesOf(point);
      for (const value of values) {
        acc.push(value);
      }
      expect(acc).to.deep.equal([1, 2]);
    });
  });

  describe('definite *', () => {
    interface Obj {
      a: string;
      b: Optional<string>;
      c: Nullable<string>;
    }
    const obj: Obj = { a: 'foo', b: undefined, c: null };
    const dict: Dictionary<Nullable<string>> = {
      a: 'foo',
      b: undefined,
      c: null,
    };

    describe('definiteEntriesOf', () => {
      it("should allow convenient enumeration of a well-typed object's entries containing definite values", () => {
        const entries = definiteEntriesOf(obj); // ['a' | 'b' | 'c', string][]
        expect(entries).to.deep.equal([['a', 'foo']]);
      });

      it("should allow convenient enumeration of a dictionary's entries containing definite values", () => {
        const entries = definiteEntriesOf(dict); // [string, string][]
        expect(entries).to.deep.equal([['a', 'foo']]);
      });
    });

    describe('definiteKeysOf', () => {
      it("should allow convenient enumeration of a well-typed object's keys associated with definite values", () => {
        const keys = definiteKeysOf(obj); // ('a' | 'b' | 'c')[]
        expect(keys).to.deep.equal(['a']);
      });

      it("should allow convenient enumeration of a dictionary's keys associated with definite values", () => {
        const keys = definiteKeysOf(dict); // string[]
        expect(keys).to.deep.equal(['a']);
      });
    });

    describe('definiteValuesOf', () => {
      it("should allow convenient enumeration of a well-typed object's non-nullable values", () => {
        const values = definiteValuesOf(obj); // string[]
        expect(values).to.deep.equal(['foo']);
      });

      it("should allow convenient enumeration of a dictionary's non-nullable values", () => {
        const values = definiteValuesOf(dict); // string[]
        expect(values).to.deep.equal(['foo']);
      });
    });
  });
});
