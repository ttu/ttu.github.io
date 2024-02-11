---
layout: post
title: Multi-Tenancy
excerpt: What is multi tenancy and what options there is to isolate data on database level.
---

**TLDR; Multi-tenancy is an architecture in which a single instance of a software application serves multiple customers**

Each customer is called **a tenant**.

## User vs Tenant

A tenant is a group of users who share a common access with specific privileges to the software instance. 

E.g. each customer company is an own tenant, and each customer has multiple users (users/consumers and company staff members).

## Multi-user vs multi-tenant?

- In a multi-user system, multiple users can use the application
- Multi-tenancy tells us something about the architecture of the system

## Single-tenant vs multi-tenant

In Single tenant each customer has own application instance.

![https://lakshaysuri.files.wordpress.com/2019/01/single-tenant-vs-multi-tenant.png](https://lakshaysuri.files.wordpress.com/2019/01/single-tenant-vs-multi-tenant.png)

In multi-tenants single instance servers multiple customers / tenants.

![multitenancy1.png](/images/posts/multi-tenancy/multitenancy1.png)

The distinction between the customers is achieved during application design, thus customers do not share or see each other’s data. 

Tenants may be given the ability to customize some parts of the application, such as color of the user interface (UI) or business rules, but they cannot customize the application’s code. (NOTE: Custom code for tenant is naturally ok)

## Why?

- Single codebase
    - Single deployment / one deployed version
    - Development is easier (one version in use)
    - Fixes and upgrades are easier (fix and everyone get it)
- Shared resources / infrastructure
    - Operations costs are lower
    - Monitoring of a single application
- Adding a new customer is easier
    - No new deployments (Still need to create client specific configurations)

## Why not?

- Security
    - Data can be leaked, we can show wrong tenant styles etc.
- Application complexity
    - Configurations, dynamic data etc.
    - Code base is more complicated
    - Adding new customer specific features can be more complicated.
    - More abstraction; will this fix break some other tenants view?
- Reliability
    - If the system is down, it is down for every tenant

## Database level tenancy

If a single instance serves multiple customers, how do we isolate the customer data?

![database tenancy options](https://cdn-images-1.medium.com/max/332/1*lCUHhEZdrs3OH-D8duwqIA.png)

- *Single-tenancy / database per tenant:* Each database stores data from only one tenant.
- *Multi-tenancy:* Each database stores data from multiple separate tenants (with mechanisms to protect data privacy).
    - *Shared database, shared schema:* Data is in shared tables, tenants are identified by column
    - *Shared database, separate schema:* Each tenant has own tables
    

**Shared schema, shared tables, identifier column**

![multitenancy2.png](/images/posts/multi-tenancy/multitenancy2.png)

- PROS
    - Simple to update the database
    - No additional development complexity etc.
    - Adding new tenants is easy
- CONS
    - Risk of exposing one tenant's data to another tenant or updating the wrong tenant's data
        - Mitigation: Row level security
    - Limited performance tuning options
    

**Shared database, separate schema**

![multitenancy3.png](/images/posts/multi-tenancy/multitenancy3.png)

- PROS
    - Has more data isolation
    - No need for row level security
    - 1 database to manage
    - Smaller tables / smaller indexes
- CONS
    - Creating new schemas for new tenants
    - Migrations to multiple schemas
    - One tenant can reduce the performance of all tenants

**Database per tenant**

![multitenancy4.png](/images/posts/multi-tenancy/multitenancy4.png)

- PROS
    - Each tenant is isolated (no accidental access to wrong data is harder)
    - No added query complexity
    - Restoring, managing storage needs is easier
    - Adding more resources to server/instance is easy
- CONS
    - Create new databases, migrations etc.
    - Connection registry for each tenant

### Which to choose?

- If security and data isolation is your number one concern, database per tenant might be best for you
- If you are expecting a smaller number of tenants, smaller growth of data and scalability requirements, approach #1 or #2 might be for you
    - Depending on your attitude toward data isolation and complexity around maintenance
- Easier to switch from shared schema to own schema to own databases than vice versa

# Implementation Plan

### Architecture

1. ~~Separate application~~
2. Shared application

### Database tenancy level

Tenancly level should depend on data model complexity, data amount, performance and security requirements.

1. Shared database, shared schema
2. Shared database, separate schema
3. Database per tenant

### How to identify tenant

Options:
- Identify from URL
    - Get tenant from URL, e.g. **mytenant**.application.com
- Hard coded with build
    - During development we might also want to have some other way
- Send id with request headers

# Links

[https://www.sentryone.com/blog/multi-tenancy-with-sql-server-part-2-approaches](https://www.sentryone.com/blog/multi-tenancy-with-sql-server-part-2-approaches)