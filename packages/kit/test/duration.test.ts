/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { Duration, sleep } from '../src/duration';

describe('duration', () => {
  it('should have accessible quantity and units', () => {
    const duration = Duration.milliseconds(60000);
    expect(duration.quantity).to.equal(60000);
    expect(duration.unit).to.equal(Duration.Unit.MILLISECONDS);
  });

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

  it('should default to minute units', () => {
    const duration = new Duration(1);
    expect(duration.seconds).to.equal(60);
  });

  describe('as strings', () => {
    it('should print 0 regardless of unit', () => {
      expect(new Duration(0, Duration.Unit.MILLISECONDS) + '').to.equal('0');
      expect(new Duration(0, Duration.Unit.SECONDS) + '').to.equal('0');
      expect(new Duration(0, Duration.Unit.MINUTES) + '').to.equal('0');
    });
    it('should print minute', () => {
      const duration = new Duration(1);
      expect(duration + '').to.equal('1 minute');
    });
    it('should print minutes', () => {
      const duration = new Duration(2);
      expect(duration + '').to.equal('2 minutes');
    });
    it('should print second', () => {
      const duration = new Duration(1, Duration.Unit.SECONDS);
      expect(duration + '').to.equal('1 second');
    });
    it('should print seconds', () => {
      const duration = new Duration(2, Duration.Unit.SECONDS);
      expect(duration + '').to.equal('2 seconds');
    });
    it('should print millisecond', () => {
      const duration = new Duration(1, Duration.Unit.MILLISECONDS);
      expect(duration + '').to.equal('1 millisecond');
    });
    it('should print millisecond', () => {
      const duration = new Duration(2, Duration.Unit.MILLISECONDS);
      expect(duration + '').to.equal('2 milliseconds');
    });
  });

  describe('sleep', () => {
    it('should wait at least a given duration', async () => {
      const start = Date.now();
      await sleep(new Duration(20, Duration.Unit.MILLISECONDS));
      expect(Date.now() - start).to.be.gte(20 - 1); // -1 to allow for rounding errors
    });

    it('should wait at least a given number of milliseconds', async () => {
      const start = Date.now();
      await sleep(20);
      expect(Date.now() - start).to.be.gte(20 - 1); // -1 to allow for rounding errors
    });

    it('should be interruptable', async () => {
      const start = Date.now();
      const promise = sleep(20);
      promise.interrupt();
      await promise;
      expect(Date.now() - start).to.be.lte(20); // ltE to allow for rounding errs
    });
  });
});
