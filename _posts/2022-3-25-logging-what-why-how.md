---
layout: post
title: Logging - What, why and how?
excerpt: What is logging, why to use it and how to use it.
---

**Logging** is a critical tool for debugging and troubleshooting applications. It tells you what happened, and gives you the raw data to track down the issue. 
By capturing relevant information at various stages of the application's execution, logging enables developers **to pinpoint the root cause of errors** and **resolve them efficiently**.

**Monitoring** is an essential practice for **ensuring the reliability and performance of applications**. It tells you how your application is behaving by continuously gathering and analyzing data about its behavior and health. With monitoring, you can **detect issues early**, prevent downtime, and optimize resource utilization.

Logging is also an useful tool for tracking application behavior and collecting statistics, but it's important to note that it only covers a limited range of functionality. To achieve comprehensive monitoring and analytics, it's recommended to use additional services such as Datadog, New Relic, or Google Analytics.

TODO: Add link to Logtail Alerts with log queris

### What to log?

Collecting a sufficient amount of logs is essential for identifying when errors occur and determining what was happening prior to the occurrence of an error. In addition to identifying errors and their causes, logs can also aid in investigating the root cause of an issue. This is why it's important to include info logging in the logging process.

Thorough investigations into application failures, it's important to focus on the "5 W"s: 

Who, What, When, Where and Why

- Who was using the system when it failed?
- Where in the code did the application fail?
- What was the system doing when it failed?
- When did the failure occur?
- Why did the application fail?

### What kind of errors to log?

Logging can be used to **alert when issues arise**. Logging framworks can be configure to automatically send alerts through external services when certain errors occur.

Therefore it is important to **log only cases as errors where we need to act immediately**. This is not always easy to specify. So iteration is also good with logging. If we do not do anything about this case, lower error to info. It is better to log too much in the beginning, than too little.

Do not log normal application beheviour as errors, e.g. business logic rule failures, input validation failures or item is not found cases. If everything is working correctly, these are not cases where engineers need to act on immediately.

Errors should be logged only once and when it happens:

```
- Exception is raised
    - Exception is caught -> Handle & log -> Return error result
    - Exception is not caught -> Global catch -> Log → Framework will return 500
```

In some cases it is hard to define what is an error and what is not. For example, if we are fetching data from external service, we can have following cases:

```
1. Data is fetched from external service -> Error from return service
    - Log depending on response
        - Data not found -> No logging
          - Or log, if we expect that data should be there
        - Data not valid -> No logging
          - Or log, if we expect that data should be valid
        - Bad request -> Logging 
            - Depends on additional info, what went wrong? 
            - Maybe something was missing from request data?
2. Data is fetched from external service -> Data is returned -> Exception in our code
    - Log, as this is something that needs to be fixed immediately
```

## How to log?

1. Log in machine parseable format
2. Make the logs human readable as well

Do not use variables in error description/message. Services like Sentry, will then consider those as a  different errors. It is also easier to find similar messages from logs when description is always same.

```js
// Not good
log.error('Order ${order.id} creation failed for user ${user.id}: ' + ex.message);

// Good
log.error('Order creation failed for user', { order, userId: user.id, ex });
```

Additional data should be an object. This way services know how to serialize it nicely to additional data fields.¨

```js
log.error('this is the message and it should always be same', { all data, exceptions and variables in additional data });
```

```js
// Additinal data passed straight as meta data
log.error('Order creation failed', order);

// Additional data in e.g. Sentry:
{
  id: 'aaaa',
  description: 'asdasfdasdf'
}

// Additional data wrapped in object
log.error('Order creation failed', { order });

// Additional data in e.g. Sentry:
{
  order: { 
    id: 'aaaa',
    description: 'asdasfdasdf'
  }
}
```

Exceptions should also not have variables in description. It is advicable to use custom exceptions where we can pass additional information.

```js
throw new Error('Order ${order.id} creation failed for user ${user.id}');
throw new OrderCreationError('Order creation failed for user', { order, userId: user.id});
```

### Personally identifiable information (PII)

Never log any perfoally identifiable information. Some services clean up the PII from the logged data (e.g. Sentry), but all services do not do this automatically.

> PII (Personally Identifiable Information) data is any information that can be used to identify a particular individual. This can include a person's name, address, phone number, email address, social security number, driver's license number, passport number, financial account numbers, and any other information that can be used to uniquely identify a person. PII data is sensitive and should be protected to prevent identity theft, fraud, or other types of misuse.

### Logging in Python

**Adding exception info to log**

In Javascript error includes the stack, but in Python it does not. In Python it needs to be added manually.

In Python we often log exceptions with other errors on error-level. Add `exc_info=True` if the error is logged in an exception handler. It includes information about an exception that occurred in the log record.

`logger.exception()` is equivalent to calling `logger.error()` with `exc_info=True`. It is advisable to use it instead of error if possible.

```py
logger.error("Error message", {"data": data, "error": str(e)}, exc_info=True)
```

NOTE: `traceback.print_exc()` can be used to print the exception to the console.

**Python log message interpolation**

Message should not contain variables, so avoid interpolation.

```py
logger.info("test", {"new_field": 1})
# "message":"test"

logger.info("test %s", {"new_field": 1})
# "message":"test {'new_field': 1}"

logger.info("test", "new_field")
# Exception (args should be an object)

logger.info("test %s", "new_field")
# "message":"test new_field"
# In this case args doesn't need to be an object as it is interpolated to message
```

### Python and extra-object

In some examples, additional data is passed as an extra object, but this is not recommended. It is important to note that certain property names, such as `message` and `asctime`, are reserved in the extra object and should not be used.

TODO: Link to sentry example.