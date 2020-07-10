/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { StubbedType, stubInterface } from '@salesforce/ts-sinon';
import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';
import TypeCache from '../src/TypeCache';
import { FileSystem } from '../types';

type CacheValue = string | null;

const cacheNone: CacheValue = null;
const cacheInvalid: CacheValue = 'this is not json';
const cacheValid: CacheValue = JSON.stringify({
  '/fake/testObject.js': 'object',
  '/fake/testFunction.js': 'function',
});

class SystemError extends Error {
  public constructor(public code: string) {
    super();
  }
}

describe('TypeCache', () => {
  let sandbox: SinonSandbox;
  let fs: StubbedType<FileSystem>;
  let cacheValue: CacheValue;
  let typeCache: TypeCache;
  let writeError: Error | null;

  beforeEach(() => {
    sandbox = createSandbox();

    fs = stubInterface<FileSystem>(sandbox, {
      readFileSync: () => {
        if (!cacheValue) {
          throw new SystemError('ENOENT');
        }
        return Buffer.from(cacheValue);
      },
      writeFileSync: () => {
        if (writeError) {
          throw writeError;
        }
      },
    });

    typeCache = new TypeCache(fs, '/fake/cache.json');
    writeError = null;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a new cache file when one does not already exist', () => {
    cacheValue = cacheNone;
    expect(typeCache.load()).to.be.false;
    expect(fs.readFileSync.calledOnce).to.be.true;
    expect(fs.unlinkSync.notCalled).to.be.true;
    expect(typeCache.hasType('/fake/testObject.js')).to.be.false;
    expect(typeCache.hasType('/fake/testFunction.js')).to.be.false;
  });

  it('should reset the cache file if found but is not parsable', () => {
    cacheValue = cacheInvalid;
    expect(typeCache.load()).to.be.false;
    expect(fs.readFileSync.calledOnce).to.be.true;
    expect(fs.unlinkSync.notCalled).to.be.false;
    expect(typeCache.hasType('/fake/testObject.js')).to.be.false;
    expect(typeCache.hasType('/fake/testFunction.js')).to.be.false;
  });

  it('should load an existing cache file if one is found and is valid', () => {
    cacheValue = cacheValid;
    expect(typeCache.load()).to.be.true;
    expect(fs.readFileSync.calledOnce).to.be.true;
    expect(fs.unlinkSync.notCalled).to.be.true;
    expect(typeCache.getType('/fake/testObject.js')).to.equal('object');
    expect(typeCache.getType('/fake/testFunction.js')).to.equal('function');
  });

  it('should report when the cache has changed', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasChanged()).to.be.false;
    typeCache.setType('/fake/foo.js', 'object');
    expect(typeCache.hasChanged()).to.be.true;
  });

  it('should not save when its values have not changed', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasChanged()).to.be.false;
    expect(typeCache.save()).to.be.false;
    expect(fs.writeFileSync.notCalled).to.be.true;
  });

  it('should save when its values have changed', () => {
    cacheValue = cacheValid;
    typeCache.load();
    typeCache.setType('/fake/foo.js', 'object');
    expect(typeCache.hasChanged()).to.be.true;
    expect(typeCache.save()).to.be.true;
    expect(fs.writeFileSync.calledOnce).to.be.true;
  });

  it('should not die when failing to write to the cache file when saved', () => {
    writeError = new Error('Fail!');
    cacheValue = cacheValid;
    typeCache.load();
    typeCache.setType('/fake/foo.js', 'object');
    expect(typeCache.save()).to.be.false;
    expect(fs.writeFileSync.calledOnce).to.be.true;
  });

  it('should clear entries and unlink an existing cache file when reset', () => {
    cacheValue = cacheValid;
    typeCache.load();
    typeCache.setType('/fake/foo.js', 'object');
    typeCache.reset();
    expect(typeCache.hasType('/fake/foo.js')).to.be.false;
    expect(fs.unlinkSync.calledOnce).to.be.true;
  });

  it('should not die when unlinking a non-existent cache file during reset', () => {
    cacheValue = cacheValid;
    typeCache.load();
    typeCache.reset();
    expect(typeCache.hasType('/fake/foo.js')).to.be.false;
    expect(fs.unlinkSync.calledOnce).to.be.true;
  });

  it('should report when it knows the type of a given module', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasType('/fake/testObject.js')).to.be.true;
  });

  it('should report when then type of a known module is proxiable', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasProxiableType('/fake/testObject.js')).to.be.true;
  });

  it('should report when then type of a known module is not proxiable', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasProxiableType('/fake/none.js')).to.be.false;
    typeCache.setType('/fake/foo.js', 'string');
    expect(typeCache.hasProxiableType('/fake/foo.js')).to.be.false;
  });

  it('should report the correct type of a known module', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.getType('/fake/testObject.js')).to.equal('object');
  });

  it('should return an appropriate proxy target for a known module', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeof typeCache.getTargetForProxiableType('/fake/testObject.js')).to.equal('object');
    expect(typeof typeCache.getTargetForProxiableType('/fake/testFunction.js')).to.equal('function');
  });

  it('should report whether a module type is proxiable or not', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasProxiableType('/fake/testObject.js')).to.be.true;
    expect(typeCache.hasProxiableType('/fake/testFunction.js')).to.be.true;
    typeCache.setType('/fake/foo.js', 'string');
    expect(typeCache.hasProxiableType('/fake/foo.js')).to.be.false;
  });

  it("should throw an error when creating a proxy target for a module who's type is not proxiable", () => {
    cacheValue = cacheValid;
    typeCache.load();
    typeCache.setType('/fake/foo.js', 'string');
    expect(() => typeCache.getTargetForProxiableType('/fake/foo.js')).to.throw();
  });

  it('should set a module type if unknown', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasType('/fake/foo.js')).to.be.false;
    expect(typeCache.setType('/fake/foo.js', 'object')).to.be.true;
    expect(typeCache.hasType('/fake/foo.js')).to.be.true;
  });

  it('should not set a module type if already known', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasType('/fake/testObject.js')).to.be.true;
    expect(typeCache.setType('/fake/testObject.js', 'object')).to.be.false;
    expect(typeCache.hasType('/fake/testObject.js')).to.be.true;
  });

  it('should be able to clear the type of known module', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasType('/fake/testObject.js')).to.be.true;
    expect(typeCache.clearType('/fake/testObject.js')).to.be.true;
    expect(typeCache.hasType('/fake/testObject.js')).to.be.false;
  });

  it('should do nothing when clearing the type of an unknown module', () => {
    cacheValue = cacheValid;
    typeCache.load();
    expect(typeCache.hasType('/fake/foo.js')).to.be.false;
    expect(typeCache.clearType('/fake/foo.js')).to.be.false;
    expect(typeCache.hasType('/fake/foo.js')).to.be.false;
  });
});
