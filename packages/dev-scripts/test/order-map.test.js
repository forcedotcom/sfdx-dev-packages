/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { expect } = require('chai');
const orderList = require('../utils/order-map');

describe('order-maps', () => {
  it('orders unordered keys', () => {
    const obj = { b: 'b', c: 'c', a: 'a' };
    const expected = '{"a":"a","b":"b","c":"c"}';

    expect(JSON.stringify(orderList(obj))).to.equal(expected);
  });
});
