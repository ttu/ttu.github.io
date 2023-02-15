---
layout: post
title: Result type, monadic type and why there is always a map-function?
excerpt: What is a result type, what is a monadic type and why they always have a map-function
---

Wikipedia definition: [https://en.wikipedia.org/wiki/Result_type](https://en.wikipedia.org/wiki/Result_type)

> a result type is a Monadic type holding a returned value or an error code. They provide an elegant way of handling errors, without resorting to exception handling; when a function that may fail returns a result type, the programmer is forced to consider success or failure paths, before getting access to the expected result; this eliminates the possibility of an erroneous programmer assumption

**NOTE:** Not only FP-fanboy type. Some languages support result types out of the box and some with packages

- [Swift - Result](https://developer.apple.com/documentation/swift/result)
- [Rust - Result](https://doc.rust-lang.org/std/result/)

## Why would we like to use the result type

- We want to explicitly define types that function can return
- Easy to define if the return value is a success or error
- No need to design our own custom return types, we get what we need out of the box

## Result type example with ts-result

Hi! This is the Result...

![Result container](/images/posts/result-type/result_type_1.png)

Source for all images: https://hackernoon.com/kotlin-functors-applicatives-and-monads-in-pictures-part-1-3-c47a1b1ce251

```ts
import { Ok, Err, Result } from "ts-results";

// These are just some helper functions
const someNumberInResult = () => Ok(2);
const someErrorInResult = () => Err(2);
const addThreeToNumber = (x: number) => x + 3;

const result = someNumberInResult();

// Result is a data type that has a value inside
// Also more specific type if it is a success or an error
// Ok type and Err type

// result: Ok ( 2 )

// Imagine the result as a container with the value inside
// properties to check data
console.log("Is result Ok", result.ok);
console.log("Is result Err", result.err);
console.log("Value from result", result.val);
// TIP: use only these and forget all monadic data type stuff
// It is ok to leave the presentation now

// and then some attached functions and apply manipulations to the data
// map unwraps the value from Result, executes the function, and produces a new Result
const updatedResult = result.map((r) => r + 3);
// Ok ( 5 )
// unwrap returns the value
console.log("Unwrap result", updatedResult.unwrap());

// What is the difference between val and unwrap?
// Unwrap will throw an error when if Result is Err
```

The result type has a map-function. Why is the map-function called map?

Currently most famous map-function: `Array.prototype.map()`. The `map`-function creates a new array populated with the results of calling a provided function on every element in the calling array.

The map name comes originally from mathematics and computer scientists love that stuff.

- [wikipedia - Map (mathematics)](https://en.wikipedia.org/wiki/Map_(mathematics))
- [wikipedia - Map (higher-order function)](https://en.wikipedia.org/wiki/Map_(higher-order_function))

map is the name of a higher-order function that applies a given function to each element of a function, e.g. a list, returning a list of results in the same order.

> higher-order function is a function, that takes function(s) are argument and/or returns a new function.

The concept of a map is not limited to lists: it works for sequential containers, tree-like containers, or even abstract containers such as futures and promises.

```ts
const result = someNumberInResult();

const newFunction = (x: number) => x * 2;
const newResult = result.map(newFunction);

// From Result definition:
/**
 * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value,
 * leaving an `Err` value untouched.
 *
 * This function can be used to compose the results of two functions.
 */

// So in terms of Ok: Ok<T> -> Ok<U>
// NOTE: type doesn't need to change with applied function Ok<T> -> Ok<T>

const updatedResult = result.map(addThreeToNumber);
// Ok<number> -> Ok<number>
console.log("Updatedresult value", updatedResult.val);

// Let's apply a function that transforms number to a string
const resultAsString = result.map((x) => x.toString());
// Ok<number> -> Ok<string>
console.log("resultAsString values type", typeof resultAsString.val);
```
__Summary:__ map applies a function to contained value and returns a new value

# So what is that monadic data type?

> Monadic (being or relating to a monad)

Not important in real life, but let's try to get some idea of what the monad is

### Normal functions

![Normal functions](/images/posts/result-type/result_type_2.png)

```ts
const value = 2;
const addThree = (x: number) => x + 3;
const sum = addThree(value);

console.log("Result:", result);
```

## Monadic data types

Some monad examples. These are not true monads, but close enough. True monads can be found only from Haskell-land.

![Monad](/images/posts/result-type/result_type_3.png)

- Optional (has value, doesn't have value)
- Promise (has value or error at some point)
- Result (Ok, Error, and value)

We can't apply normal functions to our "monad" container

![Normal function mondad](/images/posts/result-type/result_type_4.png)

```ts
const context: Result<number, string> = someNumberInResult();
const addThree = (x: number) => x + 3;
// Doesn't work as value is wrapped to Result (context)
const sum = addThree(context); // Error
```

Apply functions with a map!

![Apply with a map](/images/posts/result-type/result_type_5.png)

```ts
const context: Result<number, string> = someNumberInResult();
const addThree = (x: number) => x + 3;
const newContext = context.map(addThree);

console.log("Result:", newContext.val);
```

So...

Monad is a container that has a value and some attached functions (map etc.). The value will be evaluated when all operations are executed 👍

And now you know why a map has a special place in function naming.

## Links

Images are from: [https://hackernoon.com/kotlin-functors-applicatives-and-monads-in-pictures-part-1-3-c47a1b1ce251](https://hackernoon.com/kotlin-functors-applicatives-and-monads-in-pictures-part-1-3-c47a1b1ce251)

Functional Programming presentation: [https://ttu.github.io/functional-programming-presentation/](https://ttu.github.io/functional-programming-presentation/)

Presentation - How to [Get value out of your monad - Mark Seemann](https://www.youtube.com/watch?v=F9bznonKc64)

TLDW: You don't. Inject the desired behavior into the monad.

```js
const endpoint = (params) => {
	return fetchDataAsMonad(params) // fetchDataAsMonad returns a monad
		.map(data => service.canProcessData(data )) // canProcessData returns a monad
		.map(data => otherService.tryUpdateData(data)) // tryUpdateData returns a monad
		.map(result => xxx.doSomethingElse(result)) // doSomethingElse returns a monad
		.map(result => utils.intoHtmlResponse(result) // intoHtmlResponse returns a monad
		.unwrap(); // Get value out of the monad
};
```
