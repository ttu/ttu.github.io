---
layout: post
title: Synchronous vs Asynchronous Communication
excerpt: Sumamry of differences and use cases for synchronous (sync) and asynchronous (async) operations in programming.
---

The post is a summary of the differences and use cases for synchronous (sync) and asynchronous (async) operations in programming.

## Synchronous & Asynchronous

__Synchronous (sync)__ operations happen one after the other, where you wait for each to finish.

![Synchronous](/images/posts/sync-async/sync.png){: width="280" }

__Asynchronous (async)__ operations allow you to do multiple things at once without waiting for each to complete.

![Asynchronous](/images/posts/sync-async/async.png){: width="450" }

Synchronous calls are well-suited for situations where the caller requires an immediate response and can't proceed without the result.

Async events are suitable for scenarios where the caller doesn't need an immediate response or can handle the response later.

## Commands & Events

__Commands__ are sent by one actor to another specific actor with the expectation that a particular thing will happen as a result.

__Events__ are broadcast by an actor to all interested listeners.

Comamands can be synchronous or asynchronous.

![Commands](/images/posts/sync-async/command.png){: width="450" }

Events are always asynchronous.

![Events](/images/posts/sync-async/events.png){: width="450" }

Commands capture _intent_. They express our wish for the system to do something. As a result, when they fail, the sender needs to receive error information.

Events capture _facts_ about things that happened in the past. Since we don’t know who’s handling an event, senders should not care whether the receivers succeeded or failed

Link: [Architecture Patterns with Python - Commands & Events](https://www.cosmicpython.com/book/chapter_10_commands.html#_commands_and_events)

## Event vs Message terminology

__Message__ driven item is sent to a fixed receiver.

![Message](/images/posts/sync-async/message.png){: width="400" }

__Event__ driven sent item is shared with any consumer.

![Event](/images/posts/sync-async/event.png){: width="400" }

## Event Driven vs Event Sourcing

Event driven is about program flow, event sourcing about state. Event sourcing doesn't have anything to do with async communication.

__Event driven__ is a programming paradigm where the flow of the program is determined by events.

__Event Sourcing__ is a data modeling approach where the state of an application is determined by a sequence of events that have occurred over time.

If new to events, check e.g.: [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials)

## Problems with Sync

* __Resilience__: A single failed call can cause the entire process or operation to fail, and by default there is no way to retry failed calls.
    * Error recovery: “Unnecessary” failures when other system is unresponsive. In such cases, recovering from the error may require manual actions.
* __Complex logic__: Services rely on each other's responses and actions, and may need to call each other back and forth.
* __Blocking__: Performance bottlenecks when a service is slow or unresponsive.
* __Scalability__: Too many simultaneous requests can result in slow or unresponsive service.

## Why Async?

* __Resilience__: Retrying failed tasks and calling the next operation only after the previous one has succeeded. Link operations, so process can be continued from the next step.
* __Loose coupling of services__: Each service relies on events, and there is no direct connection between services.
* __Scalability__: Messages are executed one by one, and it is possible to add more consumers.

## Problems with Async

* Infrastructure setup is more complex as it often requires some intermediary service to handle the events.
* Potential complexity increase if events trigger new events, etc.
* Complicated debugging.

## Common(-ish) Problem Cases

### Case: Additional Data Is Required for Processing Event

Event processing requires additional data from the service sending the event, necessitating a call to the original service.

The event should contain all necessary data to execute the action.

![Additional data](/images/posts/sync-async/additional-data.png){: width="450" }

If this is not possible for some reason, then fetching the data is acceptable.

### Case: Need to Wait for the Response Before Continuing Execution

> NOTE: This is an example, so often moving from a single sync request to async without a good reason is simply overengineering.

Synchronous calls are necessary when an immediate response is required, and proceeding without it is impossible. 

![Sync required](/images/posts/sync-async/sync-required.png){: width="450" }

This can be achieved with an asynchronous request/reply event wrapper, where the original request blocks the execution while waiting for the response from the executing services. This pattern is usually complex to implement.

![Async wrapper](/images/posts/sync-async/async-wrapper.png){: width="600" }

Consider whether processing could be divided into multiple parts, allowing event handling to continue once the initial event is processed. This approach might be easier to implement for background tasks rather than for immediate user requests.

With this approach, it doesn't matter how long the processing takes, as the user request is handled immediately.

![Async tasks](/images/posts/sync-async/async-tasks.png){: width="600" }

For immediate user requests, it might be beneficial to separate the actual processing from the request and for the client to poll if the task has been completed.

One option is to replace polling with some event-driven mechanism, e.g. WebSockets, where the client is notified when the processing is completed.

![Async websocket](/images/posts/sync-async/async-websocket.png){: width="600" }

### Case: Complex Call Chains

Synchronous calls would block the user or system for an unacceptable duration. Errors in each call can cause the entire process to fail.

![Sync chain](/images/posts/sync-async/sync-chain.png){: width="700" }

By using asynchronous calls, the user can continue using the application while the processing is ongoing. Process execution is less error prona ad each step can be retried if it fails, and the process can continue from the last successful step.

![Choreography](/images/posts/sync-async/choreography.png){: width="700" }

### Case: Complex Flow and Transactional Operations Across Services

Asynchronous communication can involve multiple services, with each service responding to events triggered by others. Each service should know what to do upon receiving an event and how to respond to it. The flow is complex, and control of the flow is distributed among the services.

![Choreography](/images/posts/sync-async/choreography.png){: width="700" }

In scenarios where a transaction spans multiple services, using asynchronous operations can make it hard to ensure that all steps either succeed or fail together, which is necessary for keeping data consistent. For example, when placing an order that requires both inventory management and payment processing, both steps must work in sync to maintain accuracy.

![Saga](/images/posts/sync-async/saga.png){: width="650" }

By using a Saga pattern where the control of the flow is handled by a single entity (Service A in this example). Each step of the transaction publishes an event upon completion and control entity decides what to do next.
