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

## Results

Specs: Dell XPS 13, i7-6560U, 16GB, wrk at the same computer

Version|Req/sec
---|---:
netcoreapp1.1|22834.69
netcoreapp2.0|-

```
Running 10s test @ http://localhost:5000
  32 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    10.96ms    5.27ms 149.41ms   89.69%
    Req/Sec   722.56    194.31     4.22k    89.06%
  230782 requests in 10.11s, 27.07MB read
Requests/sec:  22834.69
Transfer/sec:      2.68MB
```

## Source

GitHub: [aspnet-core-benchmark](https://github.com/ttu/aspnet-core-benchmark)