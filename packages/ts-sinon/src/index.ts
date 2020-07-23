/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { SinonSandbox, SinonSpy, SinonStub } from 'sinon';

import { AnyFunction, Dictionary, isFunction } from '@salesforce/ts-types';

// Internal implementation for the generated proxy getters.
const makeProxyGet = (sandbox: SinonSandbox, members: OpenDictionary, stubMissing: boolean): any => {
  const cache: OpenDictionary = {};

  // The cache can contain any value from the target or members.
  return (target: OpenDictionary, name: string): any => {
    const stubMemberFn = (fn: OpenFunction): Stub<object & AnyFunction<any>> => {
      if (Object.keys(fn).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return stubCallable(sandbox, fn, fn);
      }
      return sandbox.stub().callsFake(fn);
    };
    // We are not a promise.
    if (target[name] == null && members[name] == null && name === 'then') {
      return undefined;
    }
    if (cache[name] != null) {
      return cache[name];
    }
    if (members[name] != null) {
      if (isFunction(members[name])) {
        cache[name] = stubMemberFn(members[name]);
      } else {
        cache[name] = members[name];
      }
    } else if (isFunction(target[name])) {
      cache[name] = stubMemberFn(target[name]);
    } else if (target[name] == null && stubMissing) {
      cache[name] = sandbox.stub();
    } else {
      cache[name] = target[name];
    }
    return cache[name];
  };
};

/**
 * A convenience for a `Dictionary` of `any` values.
 */
export type OpenDictionary = Dictionary<any>;

/**
 * A convenience for an `AnyFunction` that returns `any` value.
 */
export type OpenFunction = AnyFunction<any>;

/**
 * A stubbed function type that has the properties of both the original function type and a `SinonStub`.
 */
export type Stub<V extends OpenFunction> = V & SinonStub;

/**
 * Any type `T` whose function property values have been stubbed as {@link Stub}.
 */
export type StubbedType<T extends object> = {
  [K in keyof T]: T[K] extends OpenFunction ? Stub<T[K]> : T[K];
};

/**
 * Any {@link StubbedType} who is also a callable TypeScript function type.
 */
export type StubbedCallableType<T extends object> = Stub<StubbedType<T> & OpenFunction>;

/**
 * Provides the ability to stub methods on object instances and prototypes. More it specifically provides a mechanism
 * for stubbing private functions.
 *
 * @param sandbox The Sinon sandbox in which to perform the relevant stubbing.
 * @param target The target object of the stubbing operation.
 * @param method The method name of the stub.
 */
export function stubMethod<T extends object>(sandbox: SinonSandbox, target: T, method: string): SinonStub {
  // force method to keyof T to allow stubbing private, protected, and methods otherwise not exposed in typings
  return sandbox.stub(target, method as keyof T);
}

/**
 * Provides the ability to create a spy object on instance and prototype methods. More it specifically provides a
 * mechanism for spying on private functions.
 *
 * @param sandbox The Sinon sandbox in which to perform the relevant stubbing.
 * @param target The target object of the stubbing operation.
 * @param method The method name of the stub.
 */
export function spyMethod<T extends object>(sandbox: SinonSandbox, target: T, method: string): SinonSpy {
  // force method to keyof T to allow spying on private, protected, and methods otherwise not exposed in typings
  return sandbox.spy(target, method as keyof T);
}

/**
 * Returns a proxy of an object of type `T` whose public function property values have been replaced by properly typed
 * Sinon stubs if not already otherwise stubbed.  If the `members` object param is provided, the proxy will treat them
 * as the object's real properties and functions.  These values become the returns and fakes backing a well-typed mock
 * object.
 *
 * Note that when stubbing an object created from a class with non-public members, the resulting `StubbedType<T>` will
 * not be accepted as a stand-in for `T`.  In order to use the result as an instance of `T` (say, for dependency
 * injection use cases), use {@link fromStub} to restore the type to `T` at the constrained call site.
 *
 * @param sandbox The Sinon sandbox in which to perform the relevant stubbing.
 * @param target The target object of the stubbing operation.
 * @param members Optional overrides of zero or more members of the object.
 */
export function stubObject<T extends object>(
  sandbox: SinonSandbox,
  target: T,
  members: OpenDictionary = {}
): StubbedType<T> {
  return new Proxy(target, {
    get: makeProxyGet(sandbox, members, false),
  }) as StubbedType<T>;
}

/**
 * Returns a proxy of an object of type `T` whose function properties have been replaced by properly typed Sinon stubs
 * if not already otherwise stubbed.  If the `members` object param is provided, the proxy will treat them
 * as the object's real properties and functions.  These values become the returns and fakes backing a well-typed mock
 * object.  This is particularly valuable when you need to provide a function or class under test with an implementation
 * of a complex interface without having to manually create values for properties not involved in the test, such as
 * extensive configuration interfaces.
 *
 * Any interface properties not provided by the `members` object will be provided by the proxy as a basic `SinonStub`.
 * If this is not the desired behavior, be sure to provide your own value on the `members` object.
 *
 * @param sandbox The Sinon sandbox in which to perform the relevant stubbing.
 * @param members Optional overrides of zero or more members of the object.
 */
export function stubInterface<T extends object>(sandbox: SinonSandbox, members: OpenDictionary = {}): StubbedType<T> {
  return new Proxy(
    {},
    {
      get: makeProxyGet(sandbox, members, true),
    }
  ) as StubbedType<T>;
}

/**
 * Similar to {@link stubObject} but supports callable TypeScript function types that have both a call signature and
 * properties.
 *
 * @param sandbox The Sinon sandbox in which to perform the relevant stubbing.
 * @param target The target object of the stubbing operation.
 * @param members Optional overrides of zero or more members of the object.
 */
export function stubCallable<T extends object>(
  sandbox: SinonSandbox,
  members: OpenDictionary = {},
  fake: OpenFunction = (): void => {
    /* do nothing */
  }
): StubbedCallableType<T> {
  return new Proxy(sandbox.stub().callsFake(fake), {
    get: makeProxyGet(sandbox, members, false),
    apply: (target: OpenFunction, thisArg: unknown, argumentsList: unknown[]): any =>
      target.apply(thisArg, argumentsList),
  }) as StubbedCallableType<T>;
}

/**
 * Reverses the type conversion of an instance of a class from a `StubbedType<T>` to type the original type `T`.  This
 * is sometimes necessary because TypeScript's mapped types don't capture non-public class members -- as a result,
 * `StubbedType<T>` must be coerced * back to `T` explicitly when `T` is a class with non-public members and is being
 * passed to something that expects a real `T` value.  This will typically only be needed when injecting the return of
 * a {@link stubObject} call into a function or constructor requiring the original class type `T`.
 */
export function fromStub<T extends object>(stubbed: StubbedType<T>): T {
  // Since `stubObject` produces a `Proxy` of `T` backed by a real instance of `T`, it's safe to simply achieve this
  // with a type assertion.  Since much of the point of this library is to help avoid the need for type assertions,
  // prefer the use of using `fromStub` over the direct assertion.
  return stubbed as T;
}
