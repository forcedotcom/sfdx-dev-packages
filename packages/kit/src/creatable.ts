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
   * Asynchronously constructs and initializes a new instance of a concrete subclass with the provided `options`.
   *
   * @param options An options object providing initialization params to the async constructor.
   */
  public static async create<P, T extends AsyncCreatable<P>>(
    this: { new (options?: P): T },
    options?: P
  ): Promise<T> {
    const instance = new this(options);
    await instance.init(options);
    return instance;
  }

  /**
   * Constructs a new `AsyncCreatable` instance. For internal and subclass use only.
   * New subclass instances must be created with the static {@link create} method.
   *
   * @param options An options object providing initialization params.
   */
  public constructor(options?: O) {}

  /**
   * Asynchronously initializes newly constructed instances of a concrete subclass.
   *
   * @param options An options object providing initialization params.
   */
  protected abstract init(options?: O): Promise<void>;
}
