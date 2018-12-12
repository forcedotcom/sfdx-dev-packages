/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { asBoolean, asJsonArray, asJsonMap, asNumber, asString } from '../../src/narrowing/as';

describe('as type', () => {
  describe('asString', () => {
    it('should return undefined when passed undefined', () => {
      expect(asString(undefined)).to.be.undefined;
    });

    it('should return a string when passed a string', () => {
      const value = 'string';
      expect(asString(value)).to.equal(value);
    });

    it('should return the default when passed undefined and a default', () => {
      const def = 'string';
      expect(asString(undefined, def)).to.equal(def);
    });
  });

  describe('asNumber', () => {
    it('should return undefined when passed undefined', () => {
      expect(asNumber(undefined)).to.be.undefined;
    });

    it('should return a number when passed a number', () => {
      const value = 1;
      expect(asNumber(value)).to.equal(value);
    });

    it('should return the default when passed undefined and a default', () => {
      const def = 1;
      expect(asNumber(undefined, def)).to.equal(def);
    });
  });

  describe('asBoolean', () => {
    it('should return undefined when passed undefined', () => {
      expect(asBoolean(undefined)).to.be.undefined;
    });

    it('should return a boolean when passed a boolean', () => {
      const value = true;
      expect(asBoolean(value)).to.equal(value);
    });

    it('should return the default when passed undefined and a default', () => {
      const def = true;
      expect(asBoolean(undefined, def)).to.equal(def);
    });
  });

  describe('asJsonMap', () => {
    it('should return undefined when passed undefined', () => {
      expect(asJsonMap(undefined)).to.be.undefined;
    });

    it('should return a JsonMap when passed a JsonMap', () => {
      const value = { a: 'b', c: 'd' };
      expect(asJsonMap(value)).to.equal(value);
    });

    it('should return the default when passed undefined and a default', () => {
      const def = { a: 'b', c: 'd' };
      expect(asJsonMap(undefined, def)).to.equal(def);
    });
  });

  describe('asJsonArray', () => {
    it('should return undefined when passed undefined', () => {
      expect(asJsonArray(undefined)).to.be.undefined;
    });

    it('should return a JsonArray when passed a JsonArray', () => {
      const value = ['a', 'b'];
      expect(asJsonArray(value)).to.equal(value);
    });

    it('should return the default when passed undefined and a default', () => {
      const def = ['a', 'b'];
      expect(asJsonArray(undefined, def)).to.equal(def);
    });
  });
});
