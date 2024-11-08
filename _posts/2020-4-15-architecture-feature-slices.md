---
layout: post
title: Architectures - Feature Slices
excerpt: Vertical slices aka feature slices aka package by feature, structure the code around business aspects or features and not by the responsibility.
---

Vertical (aka feature) slices (aka package by feature) structure the code around **business aspects or features** and **not by the responsibility**. In a larger project, this enables the code to be split into smaller parts, which makes the project structure easier to understand and more maintainable. 

![image monlith vs fetures](/images/posts/feature-slices/monolith-slices-microservices.png)
Source: https://www.betterask.erni/news-room/slices-vs-layers/

In addition to what is shown in the previous image, features can also have their own APIs (routes) and database schemas, with each route being completely independent, much like a microservice, as illustrated in the next example.

### Pros and Cons

Overall, organizing code using vertical slices can streamline development, improve collaboration, and make the codebase more manageable and adaptable to changes.

__Pros__
* __Improved Maintainability:__ 
  * Vertical slices make it easier to understand and modify the codebase, especially for larger projects. 
  * Grouping related code together, vertical slices reduce the amount of context switching required to make changes, and they make it easier to identify and isolate problems.
* __Reduced Coupling:__ 
  * Vertical slices minimize coupling between different parts of the codebase, making it easier to make changes to a specific feature without affecting unrelated parts.
* __Enhanced Feature Independence:__ 
  * Vertical slices promote feature independence, which means that teams can work on different features without interfering with each other.
  * This can lead to faster development cycles and better overall project coordination.
* __Improved Developer Productivity:__ 
  * Vertical slices can improve developer productivity by making it easier to find and understand the code relevant to a specific task.
  * This can reduce the time spent searching for code and debugging issues, leading to more efficient development cycles.

__Cons__
* __Consisteny challenges:__ 
  * Maintaining consistent practices across slices can be challenging. 
  * Ensuring consistency requires good communication and following on agreed-upon standards.
* __Potential for Duplication:__ 
  * Vertical slices may lead to code duplication, as similar functionality may be implemented in multiple features. 
  * This can increase the overall codebase size and make it more difficult to maintain consistency.
* __Difficulty in Identifying Cross-Feature Dependencies:__ 
  * Identifying dependencies between features can be more difficult with vertical slices, as the code is organized around individual features rather than the overall system flow.
* __Increased Complexity for Small Projects:__ 
  * For small projects with a limited codebase, vertical slices may introduce unnecessary complexity and overhead. In such cases, a simpler, flatter structure may be more suitable.


### Feature Slice Example

![image features and layers](/images/posts/feature-slices/features-layers.png)

Note: in some languages, it is easy to organize larger projects/solutions into smaller projects with packages/projects and in some languages, organization is done with folder structure.

- All features are in their own project
    - Each project contains all configurations it needs to function
    - Each project contains all endpoints
    - No references / imports to other feature-projects
    - References and imports only to *Common*-projects
- API (server) project loads all features and initialized the configurations
    - API project has references to all features
- Feature-to-feature communication
    - Message Bus
        - In-process bus can be used if everything is running in a single API and single deployment (single process)
          - Can be switched to an external bus if features would be separated into multiple APIs (processes)
    - Injected services
        - Modules can add exposed services to DI-container with interfaces / types defined in Common-projects
        
        ```bash
        /common
          - ServiceX-interface
          - ServiceX-related types
        /moduleX
          - ServiceX-implementaion
          - Configuration
             - ServiceX added to the DI-container
        /moduleA
          - ServiceA uses ServiceX-interface (implementation injected from DI-container)
        ```
        
        - If services would be moved to own processes. Then ServiceA would need its own implementation of ServiceX (e.g. ServiceXClient implementing ServiceX-interface), which would call ServiceX-API instead of using Service directly.
- Shared database is a bit tricky as some features have only a partial view of DB models
    - e.g. A-module has full info of user (userId, addresses, contact info...), B-module only has partial info (userId and name).
    - Entities are marked as *Readable (partial)* or as *Writable (full)* with corresponding interfaces (e.g. IReadable, IWriable)
        - This way feature with a partial view of the DB-model, could not update it
        

**Module / Project References**

![image module references](/images/posts/feature-slices/module-references.png)

### JS Project and Module Structure

JS modules should follow the same kind of reference policy

```
routes.ts
server.ts
...
common/
  api.ts
  db.ts
  utils.ts
features/
  featureA/
    db.ts
    models.ts
    routes.ts
  featureB/
    ...
  featureX/
    ...
```

```tsx
// e.g. /features/payments/payments.ts

import Api from './shared/api' // Seems fine to import this

import Api from '../../features/orders/lib/api'; // Hmmmm... Should I import this?
```

[Node Hero - Project Structure Tutorial](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/)

### Front-End Feature Grouping

* Each feature has its own routing configuration, business logic, models, API, views, etc.
* React: [Grouping by features or routes](https://reactjs.org/docs/faq-structure.html#grouping-by-features-or-routes)

### Links

[Package by Feature](https://phauer.com/2020/package-by-feature/)

[Package by Layer vs Package by Feature](https://medium.com/sahibinden-technology/package-by-layer-vs-package-by-feature-7e89cde2ae3a)
