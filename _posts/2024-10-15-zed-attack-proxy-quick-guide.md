---
layout: post
title: ZAP (Zed Attack Proxy) – Getting Started with Security Testing
excerpt: A beginner’s guide to using Zed Attack Proxy (ZAP) for identifying security vulnerabilities and performing web application security tests.
---

Zed Attack Proxy (ZAP, zaproxy) is an open-source security testing tool that helps you identify security vulnerabilities in your web applications. It is a great tool for penetration testing, security testing, and security scanning. Zaproxy is easy to use and provides many features to help you uncover vulnerabilities in your web applications.

This is a brief guide on how to execute first security tests with Zaproxy.

## Getting Started with Zaproxy

To get started with Zaproxy, you need to download and install it on your machine. You can download Zaproxy from the official website [https://www.zaproxy.org/](https://www.zaproxy.org/).

## Importing URLs

Once you have installed Zaproxy, you can import the URLs of the web applications you want to test. You can import the URLs from the __Import__ menu.

URLs can be imported from a file, such as a recorded HAR file, or from a list of URLs. When testing your own API, the easiest method is to use the URL list from the OpenAPI specification.

Simply add the file or URL and click __Import__.

## Setting Attack Strength and Alert Threshold

Zaproxy provides different scan levels that you can use to test the security of your web applications. You can set the scan levels through __Analyze__ -> __Scan Profile Manager__.

* __Default attack strength__ defines the intensity of the attacks that Zaproxy will use to test the security of your web applications.
* __Default alert threshold__ sets the sensitivity for the alerts that Zaproxy will generate when it detects security vulnerabilities in your web applications.

The medium setting works well for most cases.

## Running the Security Test

Right-click on the site and select __Attack__ -> __Active Scan__.

![Run security test](/images/posts/zed-attack-proxy/active-scan.png){: width="450" }

## Executing a Request to a Single URL

Right-click on a single URL and select __Open In Requester Tab__. Make changes to the request headers, if necessary, and then click __Send__.

![Execute request to a single URL](/images/posts/zed-attack-proxy/new-request.png){: width="450" }

## Obeying the Rate Limit

When testing APIs, it is important to respect the rate limits set by the API provider. If you exceed the rate limit, you may be blocked from accessing the API.

Manually calculate how many requests per second you can make.

Enable request rate limiting by right-clicking on the site and selecting __Limit Request Rate__.

![Limit Request Rate](/images/posts/zed-attack-proxy/limit-request-rate.png){: width="250" }

## Add (Authorization) Headers

Custom headers, such as `Authorization` or `X-Api-Key`, can be added using scripts. Go to the Scripts tab and add a new __HTTP Sender__-script.

![Auth header script](/images/posts/zed-attack-proxy/auth-header-script.png){: width="350" }

The script requires only the `sendingRequest`-function:

```js
function sendingRequest(msg, initiator, helper) {
	msg.getRequestHeader().setHeader("Authorization", "Bearer some_token");
}
```

It is also good practice to add headers like `X-Security-Tester-Id: [identifier]` to requests, especially when testing production systems.


## Links

- [Zaproxy](https://www.zaproxy.org/)
- [Zaproxy - GitHub](https://github.com/zaproxy/zaproxy)
