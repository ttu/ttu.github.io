---
layout: post
title: Should exceptions be used for handling the control flow?
excerpt: Should control flow be handled with exceptions, and what are the arguments for and against this approach?
---

Two different approaches to concider for handling the control flow:

1. Use Exception to handle control flow
2. Use Exceptions only for unexpected behavior

## 1. Use Exceptions to handle control flow

```js
// Service
const returnData = (id) => {
  const fromdb = db.getDataForId(2);
  if (!fromdb) throw NotFoundError();
  if (!isValid(fromdb)) throw NotValidError();
  // Other operations ...
  return { data: fromdb, other: other };
}

// Controller
const endpoint = (req, res) => {
  const data = service.returnData(req.id);
  return res.send(result);
}

// NotFoundError and NotValidError could be handled 
// in controller or in some specific error-middleware
```

__\+__ Advantage
  * Code is often more simple
    * Especially in the case of frameworks where middleware handles exceptions
  * Throwing exceptions and exiting immediately prevents application to execute invalid actions 

__\-__ Disadvantage
  * Function declaration doesn't tell if the function will return something or are exceptions expected
  * Have to examine the code to know what the function will return
    * Will `returnData` return something or will it throw exception in some case?
  * Developers should document possible exceptions

## 2. Use Exceptions only for unexpected behavior

```js
// Service
const returnData = (id) => {
  const fromdb = db.getDataForId(2);
  if (!fromDb) return undefined;
  if (!fromDb.isValid) return undefined;
  // Other operations ...
  return { data: fromdb, other: other };
}

// Controller
const endpoint = (req, res) => {
  const result = service.returnData(req.id);
  // In case of undefined, we can't know if it is not found or not valid :(
  if (!result) return res.status(400);
  return res.send(result);
}

// If an exception is thrown server error 500 from error-middleware
// is returned from middleware
```

__\+__  Advantage
  * Function declaration states what the function will return
    * Code should be easier to read and understand
  * The flow of the application should be easier to follow, especially in larger codebases

When the function returns only _undefined_ / _null_ in case of errors, the reason why the function fails is lost.

If there are expected errors, these conditions can be made clearer with a custom result-types.

```js
// Service
const returnData = (id) => {
  const fromdb = getDataFromDb(id);
  if (!fromDb) return { succes: false, error: 'not_found', data: id };
  if (!fromDb.isValid) return { succes: false, error: 'not_valid', data: id };
  // Other operations ...
  return { succes: true, data: fromdb, other: other };
}

// Controller
const endpoint = (req, res) => {
  const result = service.returnData(req.id);
  if (!result.success) return utils.getErrorResponseForResult(res, result);
  return res.send(result);
}

// Utils
const getErrorResponseForResult = (res, result) => 
	results.error === 'not_found' ? res.status(404) : res.status(400);
```

Example with typed results: [https://github.com/vultix/ts-results#result-example](https://github.com/vultix/ts-results#result-example)

Developing an additional result-type is unnecessary since ts-result already provides the required functionality.

```js
import { Ok, Err, Result } from 'ts-results';

// Service
const returnData = (id) => {
  const fromdb = getDataFromDb(id);
  if (!fromDb) return Err({ error: 'not_found', data: id });
  if (!fromDb.isValid) return Err({ error: 'not_valid', data: id });
  // Other operations ...
  return Ok({ data: fromdb, other: other });
}

// Controller
const endpoint = (req, res) => {
  const result = service.returnData(req.id);
  if (result.err) return utils.getErrorResponseForResult(result);
  return res.send(result);
}
```

Read more: [https://en.wikipedia.org/wiki/Result_type](https://en.wikipedia.org/wiki/Result_type)

> a result type is a Monadic type holding a returned value or an error code. They provide an elegant way of handling errors, without resorting to exception handling; when a function that may fail returns a result type, the programmer is forced to consider success or failure paths, before getting access to the expected result; this eliminates the possibility of an erroneous programmer assumption

__NOTE:__ Result is not only FP-fanboy type. Some languages support result types out of the box and some with additional packages
* [Swift - Result](https://developer.apple.com/documentation/swift/result)
* [Rust - Result](https://doc.rust-lang.org/std/result/)


## Control flow from a Separation of Concern perspective

General practice for a layered web architecture / "Controller -> Service -> Repository"-pattern is, that each layer has its own responsibility.

![image Web App layers](/images/posts/exceptions/web-app-layers.png){:width="50%"}

A common practice is for each layer of an application to throw exceptions, which are then handled by exception middleware. This middleware returns an HTTP response with an appropriate status code and an error-related payload. Some frameworks refer to this middleware as an _Exception Layer_.

Using exceptions is a **simple** way to handle control flow, particularly in smaller applications where it eliminates the need for "boilerplate" result-type code. This makes the code faster to read and easier to understand.

Another advantage of using exceptions is that it follows the _Fail fast and exit_ principle. This reduces the likelihood of the system executing any unexpected behavior after an error has occurred.

However, using exceptions to handle control flow breaks the flow where the request and return value pass through every layer. Instead, the system relies on the middleware to handle all exceptions from all layers. Therefore, it is important that the middleware can handle all possible exceptions.

![image Exception layer](/images/posts/exceptions/exception-layers.png){:width="40%"}

**Simple** if you know how framework works. 

**Simple** when writing the code.

**Worse** if not familiar with the Framework. 

**Worse** if reading through unfamiliar code and trying to figure out the flow.

Sometimes, following established practices is worthwhile even if it leads to more code.

## Links etc.

[https://fsharpforfunandprofit.com/posts/exceptions/#the-error-code-based-approach](https://fsharpforfunandprofit.com/posts/exceptions/#the-error-code-based-approach)