---
layout: post
title: Efficiently Securing Web Applications Against Denial-of-Service Attacks
excerpt: How to improve the security of your customer-facing APIs and prevent malicious users from crashing your system with multiple requests.
---

Security is a large topic. This post is aimed at __developers__ and focuses on the security of customer-facing APIs. This post gives tips on how to prevent malicious users from crashing the system by sending multiple requests (denial-of-service attack). Executing this kind of attack is easy and can be done by almost anyone.

Every web application that exposes APIs to the public is at risk of denial-of-service attacks. These attacks can overwhelm your servers, causing them to crash or become unresponsive. This can lead to data loss, service downtime and reputational damage.

With these simple yet effective methods, you can enhance the security of your APIs and improve performance at the same time.

These measures can be implemented rather easily on top of your existing API infrastructure, regardless of the technology stack and size of your application.

![No protection](/images/posts/securing-web-app/no-protection.png){: width="650" }

Some of these measures can be implemented in the application code and some can be implemented in the different parts of the infrastructure.

![Infrastructure](/images/posts/securing-web-app/infrastructure.png){: width="800" }

__Checklist:__

- [x] Do Not Leave Open Endpoints
- [x] Cache As Much As Possible
- [x] Rate Limiting
- [x] Blocking A User
- [x] Duplicate Identical Request Detection and Prevention
- [x] Idempotency
- [x] Web Application Firewall


## Do Not Leave Open Endpoints

There shouldn't be any open customer-facing endpoints, unless it is really required that anyone can use those. 

Ensure that all endpoints in your APIs have proper authorization mechanisms in place. This can help prevent unauthorized access to sensitive data and prevent unnecessary load on the system.

![Forbidden](/images/posts/securing-web-app/auth-forbidden.png){: width="650" }

Remember that authenticated users can still be threats. If a customer is allowed to have unlimited access after the authentication, it will leave a door open for attackers to try to crash the system by creating multiple accounts and sending multiple requests.


## Cache As Much As Possible

Implement caching to protect your APIs from denial-of-service attacks. It also reduces the load on your servers and improves response times for users. Multiple benefits in one!

Cache can be implemented in various ways, but good practice is to implement it as close to customer as possible. Less load on the server and faster response times for the users.

![Cache locations](/images/posts/securing-web-app/cache-location.png){: width="800" }

Cache can store data by creating a cache key from HTTP headers, cookies, or other application-level data, for example.

### 1. Cache In CDN

Content Delivery Network (CDN) can cache the responses and serve them to the users. Request will never hit your own infrastructure, if the response is in the cache.

![Cache CDN](/images/posts/securing-web-app/cache-cdn.png){: width="650" }

### 2. Cache In Load Balancer

Load Balancer can cache the responses and serve them to the users. Request will never hit the service, if the response is in the cache.

![Cache Load Balancer](/images/posts/securing-web-app/cache-lb.png){: width="650" }

### 3. Cache In The Request Handling Middleware

Middleware can cache the responses and serve them to the users. Request will never hit the business logic, if the response is in the cache.

![Cache Middleware](/images/posts/securing-web-app/cache-middleware.png){: width="650" }

###  4. Cache In The Application Logic

Application logic can cache data from DB or external services. Request will never hit the DB, external services or slow business logic, if the response is in the cache.

![Cache part of service](/images/posts/securing-web-app/cache-service.png){: width="650" }

### Risks With Cached data


> There are only two hard things in Computer Science: cache invalidation and naming things.
>
> 
> -- Phil Karlton

When using cached data, there is always a higher risk of serving incorrect data. Risks can be e.g.:

* __Stale Data__: Cached data may become outdated, leading to users receiving incorrect information.
* __Inconsistent Data__: Changes in the backend might not reflect immediately in the cache, causing discrepancies.
* __Security Risks__: Sensitive data might be cached and wrongly exposed to incorrect or unauthorized users.

#### Stale data mitigation

Serving stale data can be avoided with cache invalidation. Invalidation can be done e.g. by:

* __Time-based Expiry__: Set expiration times for cached data to ensure it is periodically refreshed.
* __Event-based Invalidation__: Invalidate the cache when specific events occur, like data updates or user actions.
* __Manual Invalidation__: Provide mechanisms for administrators to manually clear the cache when needed.

Cache duration should be always be set based on the data that is being cached. This is often done with cache headers or in the code-level.  Cache duration should be either:
*  __As long as possible__: For e.g. static content and for data that is rarely updated.
* __As short as necessary__: For dynamic and frequently updated content.

For authenticated requests cache can be shorter than for public requests, but it will still help to reduce the load on the server, especially if users are making the same requests multiple times.

#### Inconsistent data mitigation

Invalidating cache by event is often done in code-level. When functionality changes the data, the caches that are related to that data should be invalidated.

Having a plan how to invalidate the cached data manually is critical. Common case can be e.g. that wrong data is inserted to DB and which is then served to customers. Even when data is fixed from the DB, the cache still serves the wrong data. In these cases there needs to be a way to invalidate the cache.

#### Security risks mitigation

Serving data that belongs to another users happens most likely due to a human error, e.g. by faulty cache configurations, for example by removing user-specifc header from used caching key, which would then cache the first users response and serving that to all sequential requests. This kind of incidents happen also to a larger companies.

[Klarna incident: users saw a subset of their information exposed to other app users](https://www.klarna.com/us/blog/may-27-incident-report/).


## Rate Limiting

Rate limiting is an effective way to prevent abuse of APIs and it can help to protect your APIs from denial-of-service attacks.

Rate-limiting can be implemented in various ways:
- __IP Address:__ Limit the number of requests per IP address
- __User Account:__ Restrict requests based on user accounts
- __API Key:__ Enforce limits on API keys
- __Specific Endpoints or Methods:__ Apply different rate limits to specific endpoints or HTTP methods


Rate limiting can be implemented at multiple points in the network stack, including:
- __Content Delivery Network (CDN):__ Rate limiting at the edge network before traffic reaches your infrastructure
- __Load Balancer:__ Apply rate limits at the load balancer level to reduce load on backend servers
- __Middleware:__ Implement rate limiting in the application layer using middleware

![Rate Limiting](/images/posts/securing-web-app/rate-limiting.png){: width="650" }

Be cautious when applying rate limits based on IP addresses since users behind Network Address Translation (NAT) may share a single public IP address. This can lead to legitimate users being blocked unintentionally.

## Blocking A User

Implement mechanisms to block users who violate your API usage policies. This can help protect your APIs from abuse and unauthorized access.

* Block a single authenticated user
* Block user by IP address
* Invalidate authentication tokens

Blocking a single user can be done with a flag in the database, which can be toggled manually or automatically if the user violates the policies.

Blocking a user by IP address can be done in the CDN, WAF, load balancer, or middleware. This is useful if the user is not authenticated but still causing problems.

When applications use JWT tokens for authentication, it is important to have the ability to invalidate tokens when they are no longer needed. This can help when a long-lived token is used to attack the service. The recommendation is to use short-lived access tokens and long-lived refresh tokens. This way, the refresh token can be invalidated if needed and there is no need to check validity of authentication token on every request. The refresh token should also be tied to a specific device so that if the token is stolen, it can't be used on another device.


## Duplicate Identical Request Detection And Prevention

Sites should strive to prevent duplicate (identical) requests. This helps protect your APIs from replay attacks and, for example, prevents users from posting the same comment multiple times.

Often, site users can submit requests or post comments, and some of these duplicate requests may be accidental while others may be malicious. Either way, it's good practice to prevent these requests as it helps reduce load and maintain data integrity.

Sometimes users need to be authenticated, but there are situations where users must be able to submit data without authentication.

![Duplicate request prevention](/images/posts/securing-web-app/duplicate-request.png){: width="650" }

When the user is authenticated, prevention is straightforward since the server can use the user's session to detect and prevent duplicate requests. For example, a user can only post a comment once per X seconds.

When the user is not authenticated, the server can use other methods to detect and prevent duplicate requests. This detection can be based on the content of the request (e.g., submitter name, email address, or IP address) or a combination of these.

```
Request 
Headers: [x-auth-token] [ip-address]
Body:
{
  "reply_to_email": "mail@example.com",
  "comment": "This is a great post!"
}
```

The implementation can be quite simple. For instance, create a key or a hash from selected data and store it in as a cache entry that will invalidate in X seconds. If a new request comes in with the same hash, return an error.

Sometimes it makes sense to return a failure status, but in other cases, it might be better to return a success status while not processing the request. This way, a malicious user doesn't know if the request was processed or not. For internal applications, it might be preferable to return a failure status so that users can be notified that the request was not processed.


## Idempotency

Ensure that your APIs are idempotent, meaning that identical requests can be made multiple times without changing the result beyond the initial application state. This prevents unintended side effects and data corruption.

When the server receives a request (e.g., to create a new order), it should check if the order already exists. If it does, return the existing order. If it doesn't, create and return a new order. This ensures that subsequent identical requests do not create duplicate orders or modify existing ones unintentionally.


![Idempotency](/images/posts/securing-web-app/idempotency.png){: width="650" }

This can be implemented in a same way as duplicate request detection and prevention, but the server should return the same response for the same request. If using a key or a hash is not possible, then the server can check from the DB if the same request has been made before.

This doesn't only protect the site from external attacks, but also from internal bugs or from network unreability.


## Web Application Firewall (WAF)

Web Application Firewall (WAF) should probably be first in the list as it should be the first line of defense for your APIs. The core feature of all WAFs is that they make it easier to block web requests. Lot's of this functionality could be handled in web server or application code, but WAF provides this functionality out of the box. Likely also more efficiently.

Already out of the box those can provide a good protection against common attacks, including SQL injection, cross-site scripting (XSS), reputational blocking, geoblocking, rate limiting, bot protection and more.

WAF can be implemented in various ways:

* __Cloud-based WAF:__ A cloud-based WAF can protect your APIs from attacks without requiring any additional hardware or software.
  * __AWS or Azure WAF:__ Cloud providers can provide WAF services.
  * __CDN:__ CDN e.g. CloudFlare can provide WAF services.
  
* __On-premises WAF:__ An on-premises WAF can provide additional security for your APIs by inspecting traffic before it reaches your servers.
  * __Load Balancer:__ Load balancer can provide WAF functionality.

* __Application-level WAF:__ An application-level WAF can provide additional security for your APIs by inspecting traffic at the application layer.
  * __Middleware:__ Middleware can provide WAF functionality.


## Helping the users

There are some steps that do not directly affect the security of the API, but can help the users to use the API in a secure way and improve performance.

### CORS

Cross-Origin Resource Sharing (CORS) is a security feature that allows you to restrict which domains can access your APIs.

```txt
Access-Control-Allow-Origin: https://my-site.com
```

CORS protects users by ensuring that a malicious third party cannot create a site like my-fake-site.com and deceive users into using it instead of my-site.com, thus preventing them from stealing user information.

![CORS](/images/posts/securing-web-app/cors.png){: width="650" }

CORS restrictions apply only to web browsers, protecting users from malicious websites. CORS does not apply to server-to-server communications or scripts.

A malicious site owner can have their own server that calls the API and then sends the data to the malicious site.

As attackers can still create scripts that directly call the API; therefore, CORS is not a standalone security feature. 

### Browser caching

Set cache headers correctly to help the users browser to cache the data. This will help the users to get the data faster and reduce the load on the server. 

![Browser cache](/images/posts/securing-web-app/browser-cache.png){: width="400" }

CDN may also use these cache headers to decide how it will cache and serve the content to the users without hitting the server.

### Security headers

Prevent account hijacking, clickjacking, and other attacks by implementing security headers in your APIs. These headers can help to protect your APIs from various types of attacks and vulnerabilities.

* Content-Security-Policy (CSP)
* Strict-Transport-Security (HSTS)
* X-Content-Type-Options
* X-Frame-Options
* X-XSS-Protection
* Referrer-Policy
* Permissions-Policys


# Links

* CDN (Traffic Control): https://traffic-control-cdn.readthedocs.io/en/latest/index.html
* Load Balancer (HAProxy): https://www.haproxy.com/
* Load Balancer (nginx): https://medium.com/@aedemirsen/load-balancing-with-docker-compose-and-nginx-b9077696f624
* WAF: https://wafris.org/guides/developers-guide-to-web-application-firewalls
