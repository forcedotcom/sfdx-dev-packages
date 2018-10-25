/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { AsyncCreatable, NoOptionsAsyncCreatable } from './creatable';

interface ConfigOptions {
    fooEnabled: boolean;
    doAsyncThing: () => Promise<void>;
}

class Config<O extends ConfigOptions> extends AsyncCreatable<O> {
    public constructor(options?: O) {
        super(options);
    }

    public getFooEnabled(): boolean {
        return this.options.fooEnabled;
    }

    protected async init(): Promise<void> {
        await this.options.doAsyncThing();
    }

    protected getDefaultOptions(): O {
        const defaults = {
            fooEnabled: true,
            doAsyncThing: async () => { }
        };
        // This type assertion sucks, but I can't find a way around it...
        // the issue is that `O` can be a broader type when subclassed, and
        // this concrete value for that may not be able to satisfy the
        // requirements of such a broader type.  It may be confusing to
        // developers that the type assertion is required -- without it,
        // this method will not compile, and the error description is not
        // entirely particularly easy to understand.  Good docs around the
        // expected uses of this pattern will be required.  Note that this
        // is really only an issue for AsyncCreatable subclasses that themselves
        // expect to be subclassed with an extension of their own `options` type.
        // I know we do this in some places, but maybe it's the exception rather
        // than the rule?
        //
        // See also the `getDefaultOptions` notes for this class's subclass.
        return defaults as O;
    }
}

interface SubConfigOptions extends ConfigOptions {
    barEnabled: boolean;
}

class SubConfig extends Config<SubConfigOptions> {
    public constructor(options?: SubConfigOptions) {
        super(options);
    }

    public getBarEnabled(): boolean {
        return this.options.barEnabled;
    }

    protected async init(): Promise<void> {
        await super.init();
    }

    protected getDefaultOptions(): SubConfigOptions {
        // In the subclass we need no such type assertion, though, since the
        // type of `options` is no longer generic in this context.  That said,
        // if a subclass does not override the generic super class's version
        // of this method, there may be errors at runtime, since the super
        // class's options may be incomplete, and the compiler has been instructed
        // in the super class's version of `getDefaultOptions` to ignore the
        // problem... which is a good example of why I hate using type assertions
        // to work around type system limitations :P  This gist is that if we
        // adopt this model, then the docs will have to clearly explain that
        // subclasses of generic super classes MUST override this method, even though
        // the compiler will happily compile.  There is an exception to this rule,
        // however -- if this class's options are the same as the super class's options
        // or only extends the super class's options with optional properties, then
        // a subclass need not strictly implement this method.  Will have to write up
        // some examples in the AsyncCreatable docs that captures these nuances.
        return Object.assign(super.getDefaultOptions(), {
            barEnabled: true
        });
    }
}

interface OptionalConfigOptions {
    bazEnabled: boolean;
}

class OptionalConfig extends AsyncCreatable<OptionalConfigOptions> {
    public constructor() {
        super();
    }

    public getBazEnabled(): boolean {
        return this.options.bazEnabled;
    }

    protected async init(): Promise<void> {
        // Imagine cool async stuff here
    }

    protected getDefaultOptions(): OptionalConfigOptions {
        return { bazEnabled: true };
    }
}

class NoOptionsConfig extends NoOptionsAsyncCreatable {
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
            doAsyncThing: async () => { doAsyncThingRan = true; }
        });

        expect(doAsyncThingRan).to.be.true;
        expect(config.getFooEnabled()).to.be.true;
    });

    it('should construct a concrete sub-subclass async with options', async () => {
        let doAsyncThingRan = false;
        const config = await SubConfig.create({
            fooEnabled: true,
            doAsyncThing: async () => { doAsyncThingRan = true; },
            barEnabled: true
        });

        expect(doAsyncThingRan).to.be.true;
        expect(config.getFooEnabled()).to.be.true;
        expect(config.getBarEnabled()).to.be.true;
    });

    it('should construct a concrete subclass async with optional options', async () => {
        const config1 = await OptionalConfig.create();

        expect(config1.getBazEnabled()).to.be.true;

        const config2 = await OptionalConfig.create({
            bazEnabled: true
        });

        expect(config2.getBazEnabled()).to.be.true;
    });

    it('should construct a concrete subclass async with no options', async () => {
        await NoOptionsConfig.create();
    });
});
