/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * A base class for classes that must be constructed and initialized asynchronously.
 */
export abstract class AsyncCreatable<O = object> {
  /**
   * Constructs a new `AsyncCreatable` instance. For internal and subclass use only.
   * New subclass instances must be created with the static {@link create} method.
   *
   * @param options An options object providing initialization params.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public constructor(options: O) {
    /* leave up to implementer */
  }

  /**
   * Asynchronously constructs and initializes a new instance of a concrete subclass with the provided `options`.
   *
   * @param options An options object providing initialization params to the async constructor.
   */
  public static async create<P, T extends AsyncCreatable<P>>(this: new (opts: P) => T, options: P): Promise<T> {
    const instance = new this(options);
    await instance.init();
    return instance;
  }

  /**
   * Asynchronously initializes newly constructed instances of a concrete subclass.
   */
  protected abstract init(): Promise<void>;
}

/**
 * A base class for classes that must be constructed and initialized asynchronously without requiring an options object.
 */
export abstract class AsyncOptionalCreatable<O = object> {
  /**
   * Constructs a new `AsyncCreatable` instance. For internal and subclass use only.
   * New subclass instances must be created with the static {@link create} method.
   *
   * @param options An options object providing initialization params.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public constructor(options?: O) {
    /* leave up to implementer */
  }

  /**
   * Asynchronously constructs and initializes a new instance of a concrete subclass with the optional `options`.
   *
   * @param options An options object providing initialization params to the async constructor.
   */
  public static async create<P, T extends AsyncOptionalCreatable<P>>(
    this: new (opts?: P) => T,
    options?: P
  ): Promise<T> {
    const instance = new this(options);
    await instance.init();
    return instance;
  }

  /**
   * Asynchronously initializes newly constructed instances of a concrete subclass.
   */
  protected abstract init(): Promise<void>;
}
