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

  describe('millseconds', () => {
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

    it('should convert milliseconds to hours', () => {
      const duration = Duration.milliseconds(3600000);
      expect(duration.hours).to.equal(1);
    });

    it('should convert milliseconds to day', () => {
      const duration = Duration.milliseconds(86400000);
      expect(duration.days).to.equal(1);
    });

    it('should convert milliseconds to week', () => {
      const duration = Duration.milliseconds(604800000);
      expect(duration.weeks).to.equal(1);
    });
  });

  describe('seconds', () => {
    it('should convert seconds to milliseconds', () => {
      const duration = Duration.seconds(1);
      expect(duration.milliseconds).to.equal(1000);
    });

    it('should convert seconds to seconds', () => {
      const duration = Duration.seconds(60);
      expect(duration.seconds).to.equal(60);
    });

    it('should convert seconds to minutes', () => {
      const duration = Duration.seconds(60);
      expect(duration.minutes).to.equal(1);
    });

    it('should convert seconds to hours', () => {
      const duration = Duration.seconds(3600);
      expect(duration.hours).to.equal(1);
    });

    it('should convert seconds to days', () => {
      const duration = Duration.seconds(86400);
      expect(duration.days).to.equal(1);
    });

    it('should convert seconds to weeks', () => {
      const duration = Duration.seconds(604800);
      expect(duration.weeks).to.equal(1);
    });
  });

  describe('minutes', () => {
    it('should convert minutes to milliseconds', () => {
      const duration = Duration.minutes(1);
      expect(duration.milliseconds).to.equal(60000);
    });

    it('should convert minutes to seconds', () => {
      const duration = Duration.minutes(1);
      expect(duration.seconds).to.equal(60);
    });

    it('should convert minutes to minutes', () => {
      const duration = Duration.minutes(1);
      expect(duration.minutes).to.equal(1);
    });

    it('should convert minutes to hours', () => {
      const duration = Duration.minutes(60);
      expect(duration.hours).to.equal(1);
    });

    it('should convert minutes to days', () => {
      const duration = Duration.minutes(1440);
      expect(duration.days).to.equal(1);
    });

    it('should convert minutes to weeks', () => {
      const duration = Duration.minutes(10080);
      expect(duration.weeks).to.equal(1);
    });
  });

  describe('hours', () => {
    it('should convert hours to milliseconds', () => {
      const duration = Duration.hours(1);
      expect(duration.milliseconds).to.equal(3600000);
    });

    it('should convert hours to seconds', () => {
      const duration = Duration.hours(1);
      expect(duration.seconds).to.equal(3600);
    });

    it('should convert hours to minutes', () => {
      const duration = Duration.hours(1);
      expect(duration.minutes).to.equal(60);
    });

    it('should convert hours to hours', () => {
      const duration = Duration.hours(60);
      expect(duration.hours).to.equal(60);
    });

    it('should convert hours to days', () => {
      const duration = Duration.hours(24);
      expect(duration.days).to.equal(1);
    });

    it('should convert hours to weeks', () => {
      const duration = Duration.hours(96);
      expect(duration.weeks).to.equal(1);
    });
  });

  describe('days', () => {
    it('should convert days to milliseconds', () => {
      const duration = Duration.days(1);
      expect(duration.milliseconds).to.equal(86400000);
    });

    it('should convert days to seconds', () => {
      const duration = Duration.days(1);
      expect(duration.seconds).to.equal(86400);
    });

    it('should convert days to minutes', () => {
      const duration = Duration.days(1);
      expect(duration.minutes).to.equal(1440);
    });

    it('should convert days to hours', () => {
      const duration = Duration.days(1);
      expect(duration.hours).to.equal(24);
    });

    it('should convert days to days', () => {
      const duration = Duration.days(30);
      expect(duration.days).to.equal(30);
    });

    it('should convert days to weeks', () => {
      const duration = Duration.days(7);
      expect(duration.weeks).to.equal(1);
    });
  });

  describe('weeks', () => {
    it('should convert weeks to milliseconds', () => {
      const duration = Duration.weeks(1);
      expect(duration.milliseconds).to.equal(604800000);
    });

    it('should convert weeks to seconds', () => {
      const duration = Duration.weeks(1);
      expect(duration.seconds).to.equal(604800);
    });

    it('should convert weeks to minutes', () => {
      const duration = Duration.weeks(1);
      expect(duration.minutes).to.equal(10080);
    });

    it('should convert weeks to hours', () => {
      const duration = Duration.weeks(1);
      expect(duration.hours).to.equal(168);
    });

    it('should convert weeks to days', () => {
      const duration = Duration.weeks(1);
      expect(duration.days).to.equal(7);
    });

    it('should convert weeks to weeks', () => {
      const duration = Duration.weeks(7);
      expect(duration.weeks).to.equal(7);
    });
  });

  it('should default to minute units', () => {
    const duration = new Duration(1);
    expect(duration.seconds).to.equal(60);
  });

  describe('as strings', () => {
    it('should print 0 regardless of unit', () => {
      expect(new Duration(0, Duration.Unit.MILLISECONDS) + '').to.equal('0 milliseconds');
      expect(new Duration(0, Duration.Unit.SECONDS) + '').to.equal('0 seconds');
      expect(new Duration(0, Duration.Unit.MINUTES) + '').to.equal('0 minutes');
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
