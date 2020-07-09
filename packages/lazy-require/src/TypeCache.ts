import { debug, trace } from './debug';
import { FileSystem, ProxiableModule } from './types';

export default class TypeCache {
  private changed = false;

  public constructor(
    private fsLib: FileSystem,
    private cacheFile: string,
    private values: { [key: string]: string } = {}
  ) {}

  public load(): boolean {
    let json;
    try {
      debug('loading type cache from %s', this.cacheFile);
      json = this.fsLib.readFileSync(this.cacheFile).toString('utf8');
      debug('loaded type cache');
    } catch (err) {
      if (err.code === 'ENOENT') {
        debug('type cache not found');
        return false;
      }
      throw err;
    }
    try {
      debug('parsing type cache');
      const values = JSON.parse(json);
      this.values = Object.assign(this.values, values);
      debug('parsed type cache');
    } catch (err) {
      debug('removing corrupted type cache');
      this.fsLib.unlinkSync(this.cacheFile);
      return false;
    }
    return true;
  }

  public save(): boolean {
    debug('saving type cache to %s', this.cacheFile);
    if (!this.changed) {
      debug('no changes to save');
      return false;
    }
    const json = JSON.stringify(this.values);
    try {
      this.fsLib.writeFileSync(this.cacheFile, json);
    } catch (err) {
      debug(err.message);
      return false;
    }
    debug('saved type cache');
    return true;
  }

  public reset(): boolean {
    try {
      this.values = {};
      this.fsLib.unlinkSync(this.cacheFile);
    } catch (err) {
      debug(err.message);
      return false;
    }
    debug('type cache reset');
    return true;
  }

  public hasChanged(): boolean {
    return this.changed;
  }

  public hasType(filename: string): boolean {
    return !!this.values[filename];
  }

  public hasProxiableType(filename: string): boolean {
    const moduleType = this.values[filename];
    return moduleType === 'function' || moduleType === 'object';
  }

  public getType(filename: string): string {
    return this.values[filename];
  }

  public getTargetForProxiableType(filename: string): ProxiableModule {
    const moduleType = this.getType(filename);
    switch (moduleType) {
      // MUST return a function expression, not an arrow function
      case 'function':
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return function () {
          /* Do nothing */
        };
      case 'object':
        return {};
      default:
        throw new Error(`Unexpected module proxy target type: ${moduleType}`);
    }
  }

  public setType(filename: string, moduleType: string): boolean {
    if (this.values[filename] === moduleType) {
      return false;
    } else if (this.values[filename]) {
      trace('module type change: %s from %s to %s', filename, this.values[filename], moduleType);
    }
    this.values[filename] = moduleType;
    this.changed = true;
    return true;
  }

  public clearType(filename: string): boolean {
    if (this.values[filename]) {
      delete this.values[filename];
      this.changed = true;
      return true;
    }
    return false;
  }
}
