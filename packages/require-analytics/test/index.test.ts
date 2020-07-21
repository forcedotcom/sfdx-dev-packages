/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint-disable no-underscore-dangle */

import * as fs from 'fs';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { start } from '../src';

describe('start', () => {
  let sandbox: sinon.SinonSandbox;
  let error: sinon.SinonStub;
  let load: sinon.SinonStub;
  let mock: { _load: sinon.SinonStub };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    error = sandbox.stub(console, 'error');
    // simply read any file synchronously to make this mock take nontrivial time to execute
    // in node v10 we could use Atomics.wait, but test still run on node v8
    load = sandbox.stub().callsFake(() => fs.readFileSync(`${__dirname}/../package.json`));
    mock = { _load: load };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should gather analytics from Module._load', () => {
    const analytics = start(true, mock);
    mock._load('test1', {}, false);
    mock._load('test2', {}, false);
    const report = analytics.report();
    analytics.dump();

    expect(report.time).to.be.gt(0);
    expect(report.size).to.equal(2);
    expect(Object.keys(report.list).length).to.equal(2);
    expect(Object.keys(report.tree.children).length).to.equal(2);
    expect(report.tree.elapsed).to.be.gt(0);
    expect(error.calledOnce).to.be.true;
  });

  it('should do nothing when not enabled', () => {
    const analytics = start(false, mock);
    mock._load('test1', {}, false);
    mock._load('test2', {}, false);
    const report = analytics.report();
    analytics.dump();

    expect(report.time).to.be.equal(0);
    expect(report.size).to.equal(0);
    expect(Object.keys(report.list).length).to.equal(0);
    expect(Object.keys(report.tree.children).length).to.equal(0);
    expect(report.tree.elapsed).to.equal(0);
    expect(error.calledOnce).to.be.false;
  });
});
