---
layout: post
title: Logging - What, why and how?
excerpt: What is logging, why to use it and how to use it.
---

**Logging** is a critical tool for debugging and troubleshooting applications. It tells you what happened, and gives you the raw data to track down the issue.
By capturing relevant information at various stages of the application's execution, logging enables developers **to pinpoint the root cause of errors** and **resolve them efficiently**.

**Monitoring** is an essential practice for **ensuring the reliability and performance of applications**. It tells you how your application is behaving by continuously gathering and analyzing data about its behavior and health. With monitoring, you can **detect issues early**, prevent downtime, and optimize resource utilization.

Logging is also a useful tool for tracking application behavior and collecting statistics, but it's important to note that it only covers a limited range of functionality. E.g. Logs (formerly LogTail) has functionality to provide [alerts](https://betterstack.com/docs/logs/dashboards/alerts/) from specific log conditions.

To achieve comprehensive monitoring and analytics, it's recommended to use additional services such as Datadog, New Relic, or Google Analytics.

### What to log?

Collecting a sufficient amount of logs is essential for identifying when errors occur and determining what was happening prior to the occurrence of an error. In addition to identifying errors and their causes, logs can also aid in investigating the root cause of an issue. This is why it's important to include info logging in the logging process.

For thorough investigations into application failures, it's important to focus on the "5 W"s:

Who, What, When, Where and Why

- Who was using the system when it failed?
- Where in the code did the application fail?
- What was the system doing when it failed?
- When did the failure occur?
- Why did the application fail?

### What kind of errors to log?

Logging can be used to **alert when issues arise**. Logging frameworks can be configure to automatically send alerts through external services when certain errors occur.

Therefore it is important to **log only cases as errors where we need to act immediately**. This is not always easy to specify. So iteration is also good with logging. If we do not do anything about this case, lower error to info. It is better to log too much in the beginning, than too little.

Do not log normal application beheviour as errors, e.g. business logic rule failures, input validation failures or 'item not found' cases. If everything is working correctly, these are not cases where engineers need to act on immediately.

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

Separating log messages from variable information by passing variables as parameters to a logging function is often a good practice to follow.

Having variables in error descriptions or messages can make it more challenging for services to parse information from logged data. For example, monitoring services may struggle to create event data from logged messages, as it is difficult to extract significant information from changing message text. Similarly, error tracking services may face challenges in identifying unique issues when, for instance, user IDs change within the message text.

From a security point of view, it is easier to filter out sensitive information from additional data than from an error message.

```js
// Not good
log.error('Order ${order.id} creation failed for user ${user.id}: ' + ex.message);

// Good
log.error('Order creation failed for user', { orderId: order.id, userId: user.id, ex });
```

Additional data should be an object. This way services know how to serialize it nicely to additional data fields.

```js
log.error('this is the message and it should always be same', { all data, exceptions and variables in additional data });
```

```js
// Additinal data passed straight as metadata
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

It is important to provide additional information to services, e.g. if only an error message is logged, Sentry can't display additional information about logged data.

```py
log.error("Some error (%s) happened: %s", error_code, error_message)
```

Sentry displays data in following format:

```
Message:
Some error (1234) happened: Total failure

#0 1234
#1 Total failure
```

If additional data is passed as an object, services are able to parse it and display field names etc.

```py
log.error("Some error happened", {"error_code"=error_code, "error_message"=error_message})
```

```
Message:
Some error happened

error_code: 1234
error_message: Total failure
```

Exceptions should also not have variables in their description. It is advicable to use custom exceptions where we can pass additional information.

```js
throw new Error('Order ${order.id} creation failed for user ${user.id}');
throw new OrderCreationError('Order creation failed for user', { order, userId: user.id});
```

### Personally identifiable information (PII)

Do not log any personally identifiable information (PII). While some services, such as Sentry, attempt to clean up PII from logged data, not all services do this automatically.

When additional data is passed as an object, it is more straightforward to incorporate filtering logic for removing PII information.

> PII (Personally Identifiable Information) data is any information that can be used to identify a particular individual. This can include a person's name, address, phone number, email address, social security number, driver's license number, passport number, financial account numbers, and any other information that can be used to uniquely identify a person. PII data is sensitive and should be protected to prevent identity theft, fraud, or other types of misuse.

### Logging in Python

Python has slightly different recommendations for logging compared to most other languages. Interpolation of logged messages is often recommended when using logging.

Services employ mappers and parsers to address this "issue" giving them the capability to use passed arguments to extract logged data.

For new projects, it might be advisable to pass all variables in arguments (args). However, it's important to bear in mind that if libraries include logging code, they likely use interpolation.

**Adding exception info to log**

In Javascript error includes the stack, but in Python it does not. In Python it needs to be added manually.

In Python we often log exceptions with other errors at the error level. Add `exc_info=True` if the error is logged in an exception handler. It includes information about an exception that occurred in the log record.

`logger.exception()` is equivalent to calling `logger.error()` with `exc_info=True`. It is advisable to use it instead of error if possible.

```py
logger.error("Error message", {"data": data, "error": str(e)}, exc_info=True)
```

NOTE: `traceback.print_exc()` can be used to print the exception to the console.

**Formatting**

When message doesn't include any arguments, then arguments must be defined in the format.

```py
format = "%(asctime)s - %(name)s -  %(levelname)s - %(message)s - %(args)s"
```

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

In some examples, additional data is passed as [an extra object](https://docs.python.org/3/library/logging.html#logrecord-attributes) and using it can be beneficial in some cases. The use of an extra object is beneficial in scenarios where specific information must be included in all application logs, and these details depend on the execution context (e.g., session_id, request_user_id).

It is important to note that certain property names, such as `message` and `asctime`, are reserved in the extra-object and should not be used.

[extra in Sentry](https://docs.sentry.io/platforms/python/integrations/logging/)

[extra in DataDog](https://www.datadoghq.com/blog/python-logging-best-practices/#add-custom-attributes-to-your-json-logs)
