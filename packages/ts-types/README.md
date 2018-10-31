# Types for Salesforce CLI development

## What is this?

This is a simple TypeScript-oriented library developed for use in Salesforce CLI libraries, applications, and plugins consisting of two parts:

1. A collection of commonly desired types.
1. A collection of type-narrowing convenience functions for writing concise type-guards.

## Why did we create it?

We were interested in enabling strict compiler settings in TypeScript. Among the sub-settings that comprise strict mode are "strict null checks", "strict property initialization", and "no implicit any". These settings have the potential to increase code quality substantially, reducing the frequency of certain classes of runtime errors typical in JavaScript applications. They also encourage the writing of clearer code, which helps teams work together and more rapidly onboard new hires.

Of course, stricter compiler settings require developers to write more type-safe code -- or to work around the compiler's insistence on type-safety. Often this stricter style leads to more verbose code in the way of type declarations and type guards, and can require new and occasionally unfamiliar patterns to accomplish without subverting the compiler's enforcement of the type system (typically via the use of type assertions).

TypeScript provides both syntax and built-in types designed to help write well-typed code, but we can be more terse and concise by employing additional types and type-oriented utilities. That's where this library comes in.

## How will it help me?

This library has its roots in solving the problem of how to handle untyped JSON data in a type-safe way. It was born when we added some basic type declarations to replace the unsafe `any` type as a stand-in for JSON data with a type that could capture the range of data available in any JSON construct. This yielded the `AnyJson` type, which is effectively a union of all primitive and collection JSON values. The type alone was not enough to make for convenient, type-guarded handling of JSON data, however. TypeScript supports a very elegant system of control flow analysis that will narrow the type of a variable in code after the compiler can prove the set of possible types of the variable has been reduced. Using type guards in your code improves its runtime type safety characteristics, makes it more readable, and provides richer typing information for IDEs. Type guards are implemented as conditional statements, however, and can quickly become noisy and make what was once terse JavaScript code expand into several lines of type checking. This library aimed to simplify the experience of reducing the amount of type guards needed to process a typed-JSON data structure by providing several convenience functions that help extract well-typed data from such JSON structures.

For example, look at the following typical untyped JSON processing in JavaScript:

```javascript
// Concise, but not at all null-safe or type-safe; often made to be at least null-safe using lodash fns
JSON.parse(response.body).results.forEach(item => db.save(item.id, item));
```

Then a safe version in bare TypeScript using type guards:

```typescript
const json = JSON.parse(response.body);
// Type of json -> `any`, but will not be undefined or JSON.parse would throw
if (json === null && typeof json !== 'object')
  throw new Error('Unexpected json data type');
let results = json.results;
// Type of results -> `any`
if (!Array.isArray(results)) results = [];
// Type of results -> `any[]`
results.forEach(item => {
  // Type of item -> `any`
  const id = item.id;
  // Type of id -> `any`
  if (typeof id !== 'string') throw new Error('Unexpected item id data type');
  // Type of id -> `string`
  db.save(id, item);
});
```

While that's pretty safe, it's also a mess to read and write. That's why this library is here to help!

```typescript
const json = ensureJsonMap(JSON.parse(response.body));
// Type of json -> `JsonMap` or raises an error
const results = asJsonArray(json.results, []);
// Type of results -> `JsonArray` or uses the default of `[]`
results.forEach(item => {
  // Type of item -> `AnyJson`
  record = ensureJsonMap(record);
  db.save(ensureString(record.id), record);
});
```

Removing the comments, we can shorten the above somewhat to achieve something not much more complex than the original example, but with robust type and null checking implemented:

```typescript
asJsonArray(ensureJsonMap(JSON.parse(response.body)).results, []).forEach(
  item => {
    const record = ensureJsonMap(item);
    db.save(ensureString(record.id), record);
  }
);
```

The `ensure*` functions are used in this example since they will raise an error when the value being checked either does not exist or does not match the expected type. Additionally, and perhaps more importantly, the generic `any` and `AnyJson` types get progressively narrowed when using these functions to more specific types. Of course, you don't always want to raise an error when these conditions are not met, so alternative forms exist for each of the JSON data types that allow the types to be tested and narrowed -- see the `is*` and `as*` variants in the API documentation for testing and narrowing capabilities without additionally raising errors.

### Beyond JSON

After a few iterations of working on the JSON support types and utilities, it became apparent that we needed other non-JSON types and functions that provide similar capabilities. Rather than create a new library for those, we instead grew the scope of this one to contain all of our commonly used types and narrowing functions.

## References

Another Salesforce TypeScript library, [@salesforce/kit](https://www.npmjs.com/package/@salesforce/kit), builds on this library to add additional utilities. It includes additional JSON support, a lightweight replacement for `lodash`, and growing support for patterns used in other Salesforce CLI libraries and applications.
