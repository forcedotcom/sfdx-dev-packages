/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { valueOrDefault } from './base';

describe('base', () => {
  describe('valueOrDefault', () => {
    it('should return undefined when passed an undefined value and an undefined default', () => {
      expect(valueOrDefault(undefined, undefined)).to.be.undefined;
    });

    it('should return null when passed a null value and an undefined default', () => {
      expect(valueOrDefault(null, undefined)).to.be.null;
    });

    it('should return null when passed an undefined value and a null default', () => {
      expect(valueOrDefault(undefined, null)).to.be.null;
    });

    it('should return null when passed a null value and a null default', () => {
      expect(valueOrDefault(null, null)).to.be.null;
    });

    it('should return the value when passed a defined value and an undefined default', () => {
      expect(valueOrDefault('a', undefined)).to.equal('a');
    });

    it('should return the value when passed a defined value and a null default', () => {
      expect(valueOrDefault('a', null)).to.equal('a');
    });

    it('should return the value when passed a defined value and a defined default', () => {
      expect(valueOrDefault('a', 'b')).to.equal('a');
    });

    it('should return the default when passed an undefined value and a defined default', () => {
      expect(valueOrDefault(undefined, 'b')).to.equal('b');
    });

    it('should return the default when passed a null value and a defined default', () => {
      expect(valueOrDefault(null, 'b')).to.equal('b');
    });
  });
});
