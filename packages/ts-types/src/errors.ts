/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * A minimal `NamedError` implementation not intended for widespread use -- just enough to support this library's needs.
 * For a complete `NamedError` solution, see [@salesforce/kit]{@link https://preview.npmjs.com/package/@salesforce/kit}.
 */
export class NamedError extends Error {
  public readonly name: string;

  public constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

/**
 * Indicates an unexpected type was encountered during a type-narrowing operation.
 */
export class UnexpectedValueTypeError extends NamedError {
  public constructor(message: string) {
    super('UnexpectedValueTypeError', message);
  }
}

/**
 * Indicates an error while performing a JSON clone operation.
 */
export class JsonCloneError extends NamedError {
  public constructor(cause: Error) {
    super('JsonCloneError', cause.message);
  }
}
