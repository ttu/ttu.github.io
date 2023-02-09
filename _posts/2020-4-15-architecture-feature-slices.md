---
layout: post
title: Architectures - Feature Slices
excerpt: Vertical aka feature slices structure the code around business aspects or features and not by the responsibility.
---

Vertical (aka feature) slices structure the code around **business aspects or features** and **not by the responsibility**. In a larger project this enables to split the code into smaller parts which make the project structure easier to understand and more maintainable.

![image monlith vs fetures](/images/posts/feature-slices/monolith-slices-microservices.png)
Source: https://www.betterask.erni/news-room/slices-vs-layers/

Features can also have their own APIs (routes) and database schemas, like microservices, as shown in the next example.

### Feature Slice example

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
        

**Module / Project references**

![image module references](/images/posts/feature-slices/module-references.png)

### JS project and module structure

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

Node: [Node Hero - Project Structure Tutorial](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/)

### Front-end feature grouping

* Each feature has its own routing configuration, business logic, models, API, views, etc.
* React: [Grouping by features or routes](https://reactjs.org/docs/faq-structure.html#grouping-by-features-or-routes)