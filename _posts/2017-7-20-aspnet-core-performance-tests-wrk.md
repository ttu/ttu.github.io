---
layout: post
title: ASP.NET Core Performance Tests
---

How to execute performance tests for __ASP.NET Core__ with __wrk__.

### Create .NET Core Web App

Create new web app
```sh
$ dotnet new web
```

Replace code in `Program.cs`

 ```cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace AspNetCoreBenchmark
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
             .UseKestrel()
             .UseStartup<Startup>()
             .Build();

            host.Run();
        }
    }

    public class Startup
    {
        private static string response = "Hello World!";

        public void Configure(IApplicationBuilder app)
        {
            app.Run(async (context) =>
            {
                await context.Response.WriteAsync(response);
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

Specs: Dell XPS 13, i7-6560U, 16GB. ASP.NET Core server and wrk running in the same computer

Version|Req/sec
---|---:
netcoreapp2.0|29119.66
netcoreapp1.1|no difference

```
Running 10s test @ http://localhost:5000
  32 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     8.24ms    4.49ms  78.99ms   81.82%
    Req/Sec     0.93k   384.86     5.70k    91.43%
  293768 requests in 10.09s, 34.46MB read
Requests/sec:  29119.66
Transfer/sec:      3.42MB
```

## Execute benchmark for POST request with payload

More complex benchamrks need to be defined with _lua_-scripts. Check a short example how to execute POST request benchmark from the [.NET Fake JSON Server's documentation](https://github.com/ttu/dotnet-fake-json-server/blob/master/BenchmarkWrk.md).

## Source

Example benchamrking source code with with 3 different implementations (minimal, route with map, controller). GitHub repo: [aspnet-core-benchmark](https://github.com/ttu/aspnet-core-benchmark)