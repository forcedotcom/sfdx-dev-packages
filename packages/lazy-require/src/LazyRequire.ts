/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import fs = require('fs');

import LazyLoader from './LazyLoader';
import TypeCache from './TypeCache';

export default class LazyRequire {
  private lazyLoader: LazyLoader;

  public constructor(private typeCache: TypeCache, exclusions?: string[]) {
    this.lazyLoader = new LazyLoader(this.typeCache, exclusions);
  }

  public static create(typeCacheFile: string): LazyRequire {
    const typeCache = new TypeCache(fs, typeCacheFile);
    return new LazyRequire(typeCache);
  }

  /**
   * Resets the type cache, whether or not lazy loading has been started.
   */
  public resetTypeCache(): boolean {
    return this.typeCache.reset();
  }

  /**
   * Start lazy loading type-compatible modules.
   */
  public start(): void {
    if (this.lazyLoader.isEnabled()) {
      return;
    }
    this.typeCache.load();
    process.on('exit', () => this.typeCache.save());
    this.lazyLoader.enable();
  }
}
