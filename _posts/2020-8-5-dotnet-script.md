---
layout: post
title: Run C# Scripts with .NET Core
excerpt: Use dotnet script to run C# scripts with .NET Core. Compare script and execution with JS, Python and Kotlin implementations.
---

C# has had the _.csx_ file extension for scripts for a long time, but .NET lacks a clear and common way to execute these scripts.

Different scripting environmets exists for different runtimes:

- [Roslyn Scriptin API](https://github.com/dotnet/roslyn/wiki/Scripting-API-Samples) (.NET Framework)
- [Nake](https://github.com/yevhen/Nake) (.NET Framework and Mono)
- [ScriptCS](https://github.com/scriptcs/scriptcs) (.NET Framework and Mono)
- [dotnet script](https://github.com/filipw/dotnet-script) (.NET Core)

C# 9.0 will add support for top level statements and functions, so it is likely that some future release of .NET will have support for scripting.

## Dotnet Script

Dotnet script brings scripting support for .NET Core and it can be used from command line with .NET Core global tool. As .NET Core brings .NET to all platforms, this seems like to be a good way to handle scripting with C#.

Problem with scripts is often that code needs to install some packages. _Dotnet script_ doesn't require different file to define required packages, but packages can be defined in the sciprt-file and these will be downloaded automatically.

## Prerequisites

#### Install .NET Core

Check from [Dotnet Docs](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/install) how to install .NET Core for your OS.

This example installs .NET Core 3.1 for _Ubuntu 18.04_:

```sh
$ wget https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
$ sudo dpkg -i packages-microsoft-prod.deb

# Install .NET SDK
$ sudo add-apt-repository universe
$ sudo apt-get update
$ sudo apt-get install apt-transport-https
$ sudo apt-get update
$ sudo apt-get install dotnet-sdk-3.1
```

#### Install Dotnet Script

Install Dotnet script as a .NET Core global tool:

```sh
$ dotnet tool install -g dotnet-script
```

Other installations methods and full installation instructions are in [GitHub](https://github.com/filipw/dotnet-script#installing).

## Usage

### Create a Script File

Create a new script file e.g. _github.csx_. Example script will fetch start and fork count from selected repositories.

```cs
#! "netcoreapp3.1"
#r "nuget: Newtonsoft.Json, 12.0.1"

using System.Net.Http;
using Newtonsoft.Json;

var repos = new[] { "ttu/json-flatfile-datastore", "ttu/dotnet-fake-json-server", "ttu/ruuvitag-sensor" };

var client = new HttpClient();
// GitHub API requires User-Agent: https://developer.github.com/v3/#user-agent-required
client.DefaultRequestHeaders.Add("User-Agent", "your-username");

var repoTasks = repos.Select(async repo =>
{
    var response = await client.GetAsync($"https://api.github.com/repos/{repo}");
    var json = await response.Content.ReadAsStringAsync();
    dynamic content = JsonConvert.DeserializeObject(json);
    return new { repo, stars = content.stargazers_count, forks = content.forks };
});

var repoDatas = await Task.WhenAll(repoTasks);

foreach(var data in repoDatas)
    Console.WriteLine($"{data.repo} : {data.stars} - {data.forks}");
```

_csx_-files require some definitions for scripting environment:

```cs
#! "netcoreapp3.0"
```

Defines scripting environment to use _.NET Core 3.0_. Correct _.NET Core_ version must be installed manually.

```cs
#r "nuget: Newtonsoft.Json, 12.0.1"
```

Adds reference to the _Newtonsoft.Json 12.0.1_ from _NuGet_. Scripting environment automatically downloads referenced packages.

Rest of the file is normal _C#_-code.

### Execution

Execute the script file from CLI

```sh
$ dotnet script github.csx
```

### Linux/macOS

On Linux/macOS scripts can be executed like normal scripts by changing shebang directive from `#! "netcoreapp3.1"` to `#!/usr/bin/env dotnet-script` and and marking the file as executable via `chmod +x foo.csx`.

If `dotnet script init` is used to to create _csx_-file, it will automatically have the #! directive and is marked as executable.

```cs
#!/usr/bin/env dotnet-script

Console.WriteLine("Hello world");
```

**That's it :)**

### Compare to JavaScript

For comparison same code written in _JavaScript_, which is executed with _Node.js_. No installations required besides _node_ and _npm_. _C#_ code is more verbose, so it is not often as suitable for scripting, but especially when using glorified editors like _VS Code_ or IDE with the help of intellisense it doesn't matter so much. _node-fetch_-module must be installed with `npm install node-fetch`. 

```js
const fetch = require('node-fetch');

const repos = ['ttu/json-flatfile-datastore', 'ttu/dotnet-fake-json-server', 'ttu/ruuvitag-sensor'];

// GitHub API requires User-Agent: https://developer.github.com/v3/#user-agent-required
const opts = { method: 'GET', headers: { 'User-Agent': 'your-username' } };

// When using async in top level, code must be wrapped in async function. This will be "fixed" in near future.
(async () => {
  var repoPromises = repos.map(async repo => {
    const result = await fetch(`https://api.github.com/repos/${repo}`, opts);
    const json = await result.json();
    return { repo, stars: json.stargazers_count, forks: json.forks };
  });

  const repoDatas = await Promise.all(repoPromises);

  repoDatas.forEach(data => {
    console.log(`${data.repo} : ${data.stars} - ${data.forks}`);
  });
})();
```

### Compare to Python

No installations are required besides _python_ and _pip_. _aiohttp_-package must be installed with `pip install aiohttp`.

```py
import asyncio
import aiohttp

repos = ['ttu/json-flatfile-datastore', 'ttu/dotnet-fake-json-server', 'ttu/ruuvitag-sensor']
# GitHub API requires User-Agent: https://developer.github.com/v3/#user-agent-required
headers = { 'User-Agent': 'your-username' }

async def get_url(session, repo):
    async with session.get('https://api.github.com/repos/%s' % repo) as response:
        response_json = await response.json()
        return { 'repo': repo, 'stars': response_json['stargazers_count'], 'forks': response_json['forks'] }

async def run():
    async with aiohttp.ClientSession(headers=headers) as session:
        tasks = [get_url(session, repo) for repo in repos]
        return await asyncio.gather(*tasks)

loop = asyncio.get_event_loop()
future = asyncio.ensure_future(run())
result = loop.run_until_complete(future)

for x in result:
    print('%s : %s - %s' % (x['repo'], x['stars'], x['forks']))
```

### Compare to Kotlin

Kotlin has a great scripting extension KScript, which manages all dependencies automatically. Check installation guide from [GitHub](https://github.com/holgerbrandl/kscript).

```kotlin
#!/usr/bin/env kscript
//DEPS org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.2,com.github.kittinunf.fuel:fuel:2.2.1,com.fasterxml.jackson.module:jackson-module-kotlin:2.9.7

import kotlinx.coroutines.*
import com.github.kittinunf.fuel.*
import com.fasterxml.jackson.module.kotlin.*
import com.fasterxml.jackson.databind.DeserializationFeature

data class Stats(val full_name: String, val stargazers_count: Int = -1, val forks: Int = -1)

val mapper = jacksonObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

val repos = listOf( "ttu/json-flatfile-datastore", "ttu/dotnet-fake-json-server", "ttu/ruuvitag-sensor" )

val asyncRequests = repos.map { repo ->
    GlobalScope.async {
        val body = Fuel.get("https://api.github.com/repos/${repo}")
            .header("User-Agent", "user_name")
            .responseString()
            .third.component1() // result & Body
        body?.let { mapper.readValue<Stats>(it) } ?: Stats(repo)
    }
}

runBlocking {
    val results = asyncRequests.map { it.await() }
    results.forEach{ println("${it.full_name} : ${it.stargazers_count} - ${it.forks}") }
}
```

## Benefits

Scripting has also other benefits than just actual scripting.

One benefit of the scripting is the ability to quickly __try out and experiment__ with new code without the need to create the actual compiled application.

Also __sharing a single code file__, that is __easily executable__, is more handy than sharing an archived application that needs to be compiled before execution.

## Conclusion

Big benefit of _dotnet script_ is that all dependencies are defined in the same script file and script engine downloads packages automatically, which makes sharing and executing the script much easier.

What is the best and most suitable language for scripting? My opinion is that it is the language you or the team you work with feels most comfortable using. Often I would recommend _Python_ as it is installed on every _Linux_ distro, but if _C#_ is the chosen langauge, using it is extremely easy with _dotnet script_.

In general it is always good to learn new languages, so I recommend to step out of the comfort zone and learn some new languages.

Check full documentation [github.com/filipw/dotnet-script](https://github.com/filipw/dotnet-script) for more examples and how to debug scripting code with VS Code.
