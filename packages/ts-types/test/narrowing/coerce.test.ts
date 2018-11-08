/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { coerceAnyJson, coerceJsonArray, coerceJsonMap } from '../../src/narrowing/coerce';

describe('coerce type', () => {
  describe('coerceAnyJson', () => {
    it('should return undefined when passed undefined', () => {
      expect(coerceAnyJson(undefined)).to.be.undefined;
    });

    it('should return a string when passed a string', () => {
      const value = 'string';
      expect(coerceAnyJson(value)).to.equal(value);
    });

    it('should return the default when passed undefined and a default', () => {
      const def = 'string';
      expect(coerceAnyJson(undefined, def)).to.equal(def);
    });
  });

  describe('coerceJsonMap', () => {
    it('should return undefined when passed undefined', () => {
      expect(coerceJsonMap(undefined)).to.be.undefined;
    });

    it('should return a JsonMap when passed a JsonMap', () => {
      const value = { a: 'b', c: 'd' };
      expect(coerceJsonMap(value)).to.equal(value);
    });

    it('should return the default when passed undefined and a default', () => {
      const def = { a: 'b', c: 'd' };
      expect(coerceJsonMap(undefined, def)).to.equal(def);
    });
  });

  describe('coerceJsonArray', () => {
    it('should return undefined when passed undefined', () => {
      expect(coerceJsonArray(undefined)).to.be.undefined;
    });

    it('should return a JsonArray when passed a JsonArray', () => {
      const value = ['a', 'b'];
      expect(coerceJsonArray(value)).to.equal(value);
    });

    it('should return the default when passed undefined and a default', () => {
      const def = ['a', 'b'];
      expect(coerceJsonArray(undefined, def)).to.equal(def);
    });
  });
});
