---
layout: post
title: ASP.NET Core Performance Tests
excerpt: How to execute performance tests for ASP.NET Core with wrk.
---

How to execute performance tests for __ASP.NET Core__ with __wrk__.

### Create .NET Core Web App

Create new web app
```sh
$ dotnet new web
```

Replace code in `Program.cs`

 ```cs
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace AspNetCoreBenchmark
{
    public class Program
    {
        public static void Main(string[] args)
        {
            new WebHostBuilder()
                .UseStartup<Startup>()
                .Build()
                .Run();
        }
    }

    public class Startup
    {
        private static string _response = "Hello World!";

        public void Configure(IApplicationBuilder app)
        {
            app.Run(async (context) =>
            {
                await context.Response.WriteAsync(_response);
            });
        }
    }
}
```

### wrk - HTTP Benchmark Tool

Install [guide](https://github.com/wg/wrk/wiki/Installing-Wrk-on-Linux) for Linux. On Windows 10 use Bash on Ubuntu on Windows.

### Execute Performance Tests

Start the server.

```sh
$ dotnet run
```

If you run wrk from a separate computer, which is recommended, change url to bind to `*`, so server listens requests on any IP address. 

```sh
$ dotnet run --urls http://*:5000
```

Run benchmark with wrk. This run is using 256 connections across 32 client threads for a duration of 10 seconds.

```sh
$ wrk -c 256 -t 32 -d 10 http://localhost:5000
```

### Results

ASP.NET Core server and wrk running in the same computer

#### Specs: Surface Book 2, i7-8650U, 16GB

Version|Req/sec
---|---:
netcoreapp2.1|no difference
netcoreapp2.0|38149.68

```
Running 10s test @ http://localhost:61479
  32 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.61ms  766.82us  32.12ms   91.43%
    Req/Sec     1.20k   108.52     3.43k    93.65%
  385289 requests in 10.10s, 45.20MB read
Requests/sec:  38149.68
Transfer/sec:      4.48MB
```

#### Specs: Dell XPS 13, i7-6560U, 16GB

Version|Req/sec
---|---:
netcoreapp2.0|29119.66
netcoreapp1.1|no difference

## Execute benchmark for POST request with payload

More complex benchamrks need to be defined with _lua_-scripts. Check a short example how to execute POST request benchmark from the [.NET Fake JSON Server's documentation](https://github.com/ttu/dotnet-fake-json-server/blob/master/docs/BenchmarkWrk.md).

## Source

Example benchamrking source code with with 4 different implementations (minimal, route with map, route with RouteBuilder and Controller). GitHub repo: [aspnet-core-benchmark](https://github.com/ttu/aspnet-core-benchmark)

## Updates

* 10/2018: Added performance results for Surface Book 2