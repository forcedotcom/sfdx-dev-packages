/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { expect } = require('chai');
const orderList = require('../utils/order-map');

describe('order-maps', () => {
  it('orders unordered keys', () => {
    const obj = { b: 'b', c: 'c', a: 'a' };
    const expected = { a: 'a', b: 'b', c: 'c' };

    expect(obj).to.equal('{"b":"b", "c"}');
    expect(orderList(obj).to.equal('{"b":"b", "c"}'));
  });
});
