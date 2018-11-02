/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import * as _ from '.';

describe('nodash internal', () => {
  describe('isEmpty', () => {
    it('should return true given undefined', async () => {
      expect(_.isEmpty(undefined)).to.be.true;
    });

    it('should return true given null', async () => {
      expect(_.isEmpty(null)).to.be.true;
    });

    it('should return false given a number', async () => {
      expect(_.isEmpty(0)).to.be.false;
    });

    it('should return false given a boolean', async () => {
      expect(_.isEmpty(false)).to.be.false;
    });

    it('should return true given an empty array', async () => {
      expect(_.isEmpty([])).to.be.true;
    });

    it('should return false given an non-empty array', async () => {
      expect(_.isEmpty([0])).to.be.false;
    });

    it('should return true given an empty object', async () => {
      expect(_.isEmpty({})).to.be.true;
    });

    it('should return false given an non-empty object', async () => {
      expect(_.isEmpty({ a: 0 })).to.be.false;
    });

    it('should return true given an empty Map', async () => {
      expect(_.isEmpty(new Map())).to.be.true;
    });

    it('should return false given an non-empty Map', async () => {
      expect(_.isEmpty(new Map([['a', 1]]))).to.be.false;
    });
  });

  describe('lowerFirst', () => {
    it('should return undefined if passed undefined', async () => {
      expect(_.lowerFirst()).to.be.undefined;
    });

    it('should return the empty string if passed the empty string', async () => {
      expect(_.lowerFirst('')).to.equal('');
    });

    it('should return a string with a lower first letter if passed a string with length 1 or more', async () => {
      expect(_.lowerFirst('ABC')).to.equal('aBC');
    });
  });

  describe('snakeCase', () => {
    it('should snake case a variety of strings', async () => {
      let result = _.snakeCase('Foo Bar');
      expect(result).to.equal('foo_bar');

      result = _.snakeCase('fooBar');
      expect(result).to.equal('foo_bar');

      result = _.snakeCase('--FOO-BAR--');
      expect(result).to.equal('foo_bar');
    });
  });

  describe('upperFirst', () => {
    it('should return undefined if passed undefined', async () => {
      expect(_.upperFirst()).to.be.undefined;
    });

    it('should return the empty string if passed the empty string', async () => {
      expect(_.upperFirst('')).to.equal('');
    });

    it('should return a string with an upper first letter if passed a string with length 1 or more', async () => {
      expect(_.upperFirst('abc')).to.equal('Abc');
    });
  });
});
