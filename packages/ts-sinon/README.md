# TypeScript-friendly utils for Sinon testing

This is a simple library to help create stubs with Sinon when working with TypeScript in order to leverage Sinon stubs and the type system more completely together as one without resorting to ugly, untyped hacks like casting stubbed functions to `any` or using associative array accesses, neither of which provide IDE-autocompletion of stub properties and methods, nor work well with stricter `tsc` and `tslint` rules applied to test sources.

## API

The API consists of the following functions:

### stubInterface

Used to provide a fully stubbed interface backed by an optional set of member properties which may form a subset of the overall interface.  Function properties will be typed as proper `SinonStub`s along with any other specific type information provided by the interface.

### stubObject

Returns a fully stubbed proxy similar to those provided by `stubInterface`, but backed first by the optionally given members, and finally by a given object.  This is useful for stubbing some properties of an existing object while providing test-specific returns for fakes for others.

### stubCallable

Like `stubObject` but works with callable TypeScript function types (i.e., functions with properties).

### fromStub

When using `stubObject` with objects created from classes with non-public members, the resulting `StubbedType<T>` often needs to be passed to a function or constructor that expects a `T`, but TypeScript's mapped types (which are the basis of `StubbedType`) do not capture non-public class members.  Since the `StubbedType` returned from `stubObject` is backed by a real instance of type `T`, it can be simply reverted to type `T` by using `fromStub(instance)`.  The implementation of this simply applies a type assertion, but using `fromStub` is preferred for clarity, especially given that this library exists to reduce the necessity of using type assertions in tests in the first place.

