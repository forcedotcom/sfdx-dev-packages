/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { AsyncCreatable } from '../src/creatable';

class Config<O extends Config.Options> extends AsyncCreatable<O> {
  protected options: O;

  public constructor(options?: O) {
    super(options);
    if (!options) throw new Error('I can haz options!');
    this.options = options;
  }

  public getFooEnabled(): boolean {
    return this.options.fooEnabled;
  }

  protected async init(): Promise<void> {
    await this.options.doAsyncThing();
  }
}

namespace Config {
  export interface Options {
    fooEnabled: boolean;
    doAsyncThing: () => Promise<void>;
  }
}

class SubConfig extends Config<SubConfig.Options> {
  public constructor(options?: SubConfig.Options) {
    super(options);
  }

  public getBarEnabled(): boolean {
    return this.options.barEnabled;
  }

  protected async init(): Promise<void> {
    await super.init();
  }
}

namespace SubConfig {
  export interface Options extends Config.Options {
    barEnabled: boolean;
  }
}

class OptionalConfig extends AsyncCreatable<OptionalConfig.Options> {
  private options?: OptionalConfig.Options;

  public constructor(options?: OptionalConfig.Options) {
    super(options);
    this.options = options;
  }

  public getBazEnabled(): boolean {
    return this.options ? this.options.bazEnabled : false;
  }

  protected async init(): Promise<void> {
    // Imagine cool async stuff here
  }
}

namespace OptionalConfig {
  export interface Options {
    bazEnabled: boolean;
  }
}

class NoOptionsConfig extends AsyncCreatable {
  public constructor() {
    super();
  }

  protected async init(): Promise<void> {
    // Imagine cool async stuff here
  }
}

describe('AsyncCreatable', () => {
  it('should construct a concrete subclass async with options', async () => {
    let doAsyncThingRan = false;
    const config = await Config.create({
      fooEnabled: true,
      doAsyncThing: async () => {
        doAsyncThingRan = true;
      }
    });

    expect(doAsyncThingRan).to.be.true;
    expect(config.getFooEnabled()).to.be.true;
  });

  it('should construct a concrete sub-subclass async with options', async () => {
    let doAsyncThingRan = false;
    const config = await SubConfig.create({
      fooEnabled: true,
      doAsyncThing: async () => {
        doAsyncThingRan = true;
      },
      barEnabled: true
    });

    expect(doAsyncThingRan).to.be.true;
    expect(config.getFooEnabled()).to.be.true;
    expect(config.getBarEnabled()).to.be.true;
  });

  it('should construct a concrete subclass async with optional options', async () => {
    const config1 = await OptionalConfig.create();

    expect(config1.getBazEnabled()).to.be.false;

    const config2 = await OptionalConfig.create({
      bazEnabled: true
    });

    expect(config2.getBazEnabled()).to.be.true;
  });

  it('should construct a concrete subclass async with no options', async () => {
    await NoOptionsConfig.create();
  });
});
