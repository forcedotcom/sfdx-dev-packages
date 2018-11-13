import fs = require('fs');

import LazyLoader from './LazyLoader';
import TypeCache from './TypeCache';

export default class LazyRequire {
  public static create(typeCacheFile: string): LazyRequire {
    const typeCache = new TypeCache(fs, typeCacheFile);
    return new LazyRequire(typeCache);
  }

  private lazyLoader: LazyLoader;

  public constructor(private typeCache: TypeCache, exclusions?: string[]) {
    this.lazyLoader = new LazyLoader(this.typeCache, exclusions);
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
