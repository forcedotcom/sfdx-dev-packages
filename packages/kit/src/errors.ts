/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Any `Error` compatible with the `NamedError` type signature.
 */
type NamedErrorLike = Error & {
  readonly name: string;
  readonly cause?: NamedErrorLike;
  readonly fullStack?: string;
};

export class NamedError extends Error {
  public readonly name: string;
  public readonly cause?: NamedErrorLike;

  public constructor(name: string, cause?: NamedErrorLike);
  public constructor(name: string, message?: string, cause?: NamedErrorLike);
  public constructor(name: string, messageOrCause?: string | NamedErrorLike, cause?: NamedErrorLike) {
    if (typeof messageOrCause === 'string') {
      super(messageOrCause);
      this.cause = cause;
    } else {
      super();
      this.cause = messageOrCause;
    }
    this.name = name;
  }

  public get fullStack(): string | undefined {
    let stack = this.stack;
    const causedStack = this.cause?.fullStack || this.cause?.stack;
    if (causedStack) {
      stack = `${stack ? stack + '\n' : ''}Caused by: ${causedStack}`;
    }
    return stack;
  }
}

export class JsonParseError extends NamedError {
  public constructor(
    cause: Error,
    public readonly path?: string,
    public readonly line?: number,
    public readonly errorPortion?: string
  ) {
    super('JsonParseError', JsonParseError.format(cause, path, line, errorPortion), cause);
  }

  /**
   * Creates a `JsonParseError` from a `SyntaxError` thrown during JSON parsing.
   *
   * @param error The `SyntaxError` to convert to a `JsonParseError`.
   * @param data The data input that caused the error.
   * @param jsonPath The path from which the data was read, if known.
   */
  public static create(error: SyntaxError, data: string, jsonPath?: string): JsonParseError {
    // Get the position of the error from the error message. This is the error index
    // within the file contents as 1 long string.
    const positionMatch = /position (\d+)/.exec(error.message);
    if (!positionMatch) {
      return new JsonParseError(error, jsonPath);
    }
    const errPosition = parseInt(positionMatch[1], 10);

    // Get a buffered error portion to display.
    const BUFFER = 20;
    const start = Math.max(0, errPosition - BUFFER);
    const end = Math.min(data.length, errPosition + BUFFER);

    const errorPortion = data.slice(start, end);

    // Only need to count new lines before the error position.
    const lineNumber = data.slice(0, errPosition).split('\n').length;

    return new JsonParseError(error, jsonPath, lineNumber, errorPortion);
  }

  private static format(cause: Error, path?: string, line?: number, errorPortion?: string): string {
    if (line == null) return cause.message || 'Unknown cause';
    return `Parse error in file ${path || 'unknown'} on line ${line}\n${errorPortion || cause.message}`;
  }
}

export class JsonStringifyError extends NamedError {
  public constructor(cause: Error) {
    super('JsonStringifyError', cause);
  }
}

export class JsonDataFormatError extends NamedError {
  public constructor(message: string) {
    super('JsonDataFormatError', message);
  }
}

export class InvalidDefaultEnvValueError extends NamedError {
  public constructor(message: string) {
    super('InvalidDefaultEnvValueError', message);
  }
}
