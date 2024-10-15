---
layout: post
title: The Evolution of React - A Journey of Innovation and Complexity
excerpt: Let's look at the evolution of React and how it has changed over the years.
---

__This is not a criticism of React.__ This post serves as an example of how adding new functionality to a library can introduce complexities and new challenges. Especially when guidance isn’t clear or the functionality is not straightforward.

In this article, we will explore the evolution of _React_ and how it has changed over the years. _React_ has continuously evolved to meet the needs of developers and to address emerging challenges. However, this evolution has sometimes introduced new challenges, and the process hasn’t always been the most logical or well thought out.

Understanding the history, and in this case, the history of React, is important for understanding how we arrived at the current situation. It may also offer insight into where we are heading in the future.


### React Was Supposed to Be Easy

__NOTE:__ This is just based on my observations. Naturally, my observations could be wrong, and it’s possible that I was simply involved in the wrong projects. I’ll let you be the judge.

_React_ was supposed to be easy. 

However, when it was first released, the learning curve was steep—even for experienced developers. 

New features introduced over time have not always been clear, making it challenging even for more experience professionals to use those properly.

_React_ was designed to be unopinionated, but this flexibility can lead to the adoption of incorrect or inefficient practices.


### Class Components to Function Components (2014 - popularity ~2016-2017)

Initially, _React_ primarily used class components. However, even back then, function components were often used for simpler cases, especially when components were only rendering views.


### Function Components and Hooks (React 16.8 in February 2019)

As functional programming became more popular and classes were seen as less ideal, function components became the standard. But there was a limitation: function components were stateless and focused only on rendering views.

To address this, hooks were introduced, adding more power to function components.

Hooks are functions that let you use state and other React features without writing a class.

Some of the most important hooks are:

* __useState__: Allows function components to have internal state.
* __useEffect__: Manages side effects, such as data fetching or manually changing the DOM.

While hooks are great, they introduced new complexities. One key issue was unnecessary re-renders and redundant API requests.


### Hooks and Re-renders

Hooks, such as `useState` and `useEffect`, can sometimes trigger re-renders that are difficult to control.

For instance, if setState and dependecies of `useEffect` is not handled correctly, it can cause multiple re-renders. 

Improper handling of `setState` or the dependency array in `useEffect` could lead to multiple re-renders. For instance, if setState and dependecies of `useEffect` is not handled correctly, it can cause multiple re-renders. To mitigate this, React introduced hooks like:

* __useMemo__: Caches expensive calculations and only recomputes them when dependencies change.
* __useCallback__: Memoizes functions to prevent unnecessary re-creation of functions on every render.

However, managing dependencies correctly introduced its own set of challenges:

* Especially reference equality for objects and arrays
  * __array__ will cause re-render if array is new, even if array values are the same.
  * __object__ will case a re-render if object reference is different, even if object values are the same.
  * __object's value__ in a dependency array won't trigger a re-render if the value is the same, even if the object reference is different.
  * __object's array value__ will trigger a re-render if the array reference is new, even if the array values are unchanged.


### Automatic useMemo and useCallback (React 19 in 2024)

React 19 introduced automatic memoization for `useMemo` and `useCallback`, meaning developers no longer have to explicitly manage memoization in some cases. React now handles this internally, leading to fewer performance pitfalls and cleaner code.


### Hooks and Other Issues

Hooks are designed to add reusable logic to components. Although they are reusalble, they do not share state between components.

As hooks do not include any shared state between components and more than one component use the same hook, means that both components will, for example, make the same API request.

Often it is also though that only way to create reusable functionality for the components is to create custome hook. Usually normal function would be enough.

Tools like _React Query_ (now called _TanStack Query_) became popular to handle data fetching and caching efficiently, reducing the need for custom solutions.


### Native React hook to replace react-query (React xx)

TODO: When will this be released? What is it?

In response to the complexity of third-party data-fetching libraries like _React Query_, the React team is developing a native data-fetching hook. This native hook aims to simplify fetching and caching data without relying on external libraries.

While _React Query_ remains popular due to its extensive feature set, the introduction of native solutions signals React’s ongoing evolution toward solving common problems within the core library.

However, this could introduce new challenges.


### Context API and Re-renders (React 16.3 in March 2018)

Originally, _React_ lacked a clear solution for handling state management. _Redux_ quickly became the most popular option, but it required a lot of boilerplate code, making it cumbersome to use. Developers wanted a simpler solution and found that from a functionality that wasn't intended for state management.

_Context API_ was originally introduced to avoid "prop drilling" for data that doesn’t change frequently. It allows you to pass data through the component tree without having to pass props manually at every level. However, it wasn't intended for state management. Despite this, it quickly became popular for that purpose.

The problem is, when context values change, every component that consumes the context re-renders. There are patterns to mitigate this, such as using `useMemo`, but they aren’t always straightforward.

Another issue is the overuse of the _Context API_, which can lead to a "pyramid of contexts." This occurs when multiple nested Context Providers are used, making it difficult to understand where data is coming from and adding complexity to the code.

This issue led to the rise of third-party libraries like _Recoil_ and _Zustand_, which offer more robust solutions for state management.


### Native Hook for State Management (React xx)

I’ve seen posts suggesting that _React_ will introduce a native hook for state management, addressing the issues caused by the _Context API_. Unfortunately, I can't find the link at the moment.


### Routing

Routing is a main part of any web application, but _React_ doesn’t include a built-in routing solution. Developers have to choose between third-party libraries like _React Router_ or _Reach Router_.

Choosing a router has become more complex as routing solutions are now bundled with larger frameworks like _Next.js_ and _Remix_.


### State Management

React’s journey through state management libraries is extensive:

* First, there was no official state management.
* Then, Redux gained popularity.
* Then came MobX, followed by the Context API.
* After that, libraries like Recoil, Zustand, XState, Redux Toolkit, MobX State Tree, and Effector emerged.

Which should I use today?


### Unopinionated

> "No options how thigs should be done" became "Too many options how things should be done."

Originally, React was just a library, but now developers often find themselves choosing between entire frameworks like _Next.js_ or _Remix_.

While there’s nothing inherently wrong with this shift, years were spent debating libraries and frameworks—time that might have been better spent building features.


### Conclusion

The evolution of React has been long and eventful. It’s a prime example of how a library can continuously evolve, though each step can bring new challenges. While _React_’s flexibility is one of its greatest strengths, it’s also a source of complexity, requiring developers to stay constantly updated.

_React_ is a good example of how an evolving library should ensure that new functionality has a clear purpose, is easy to understand, and is well-documented. Without this, it can lead to confusion and inefficiency.