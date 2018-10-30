/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { Duration, sleep } from './duration';

describe('duration', () => {
  it('should convert milliseconds to milliseconds', () => {
    const duration = Duration.milliseconds(60000);
    expect(duration.milliseconds).to.equal(60000);
  });

  it('should convert milliseconds to seconds', () => {
    const duration = Duration.milliseconds(60000);
    expect(duration.seconds).to.equal(60);
  });

  it('should convert milliseconds to minutes', () => {
    const duration = Duration.milliseconds(60000);
    expect(duration.minutes).to.equal(1);
  });

  it('should convert seconds to seconds', () => {
    const duration = Duration.seconds(60);
    expect(duration.seconds).to.equal(60);
  });

  it('should convert seconds to minutes', () => {
    const duration = Duration.seconds(60);
    expect(duration.minutes).to.equal(1);
  });

  it('should convert minutes to minutes', () => {
    const duration = Duration.minutes(1);
    expect(duration.minutes).to.equal(1);
  });

  it('should convert minutes to seconds', () => {
    const duration = Duration.minutes(1);
    expect(duration.seconds).to.equal(60);
  });

  it('should convert minutes to milliseconds', () => {
    const duration = Duration.minutes(1);
    expect(duration.milliseconds).to.equal(60000);
  });

  it('should convert seconds to milliseconds', () => {
    const duration = Duration.seconds(60);
    expect(duration.milliseconds).to.equal(60000);
  });

  it('should default to minute units', () => {
    const duration = new Duration(1);
    expect(duration.seconds).to.equal(60);
  });

  describe('sleep', () => {
    it('should wait at least a given amount of duration', async () => {
      const start = Date.now();
      await sleep(new Duration(20, Duration.Unit.MILLISECONDS));
      expect(Date.now() - start).to.be.gte(20);
    });

    it('should wait at least a given amount of milliseconds', async () => {
      const start = Date.now();
      await sleep(20);
      expect(Date.now() - start).to.be.gte(20);
    });

    it('should be interruptable', async () => {
      const start = Date.now();
      const promise = sleep(20);
      promise.interrupt();
      await promise;
      expect(Date.now() - start).to.be.lt(20);
    });
  });
});
