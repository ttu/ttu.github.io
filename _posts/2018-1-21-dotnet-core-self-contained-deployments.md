---
layout: post
title: How to distribute a .NET Core application to users who don't have .NET Core installed
excerpt: Use .NET Core self-contained deployments to distribute a .NET Core application to as wide user base as possible.
---

* __Case:__ .NET Core application for a wide user base
* __Problem:__ Users don't have .NET Core installed
* __Solution:__ .NET Core self-contained deployments

I have a .NET Core Web Application that developers run locally. The problem is that most of the developers don't have .NET Core installed on their development machines, so there needs to be a way that all developers can use the application without needing to install .NET Core.

Docker is normally a good option, but there is still plenty of developers who are not familiar with containers. Luckily .NET Core offers another solution, which allows developers to try .NET Core applications faster and without extra installations.

### .NET Core Self-Contained Deployments

The .NET Core self-contained deployment has the application and all required third-party dependencies in a single folder, along with the version of .NET Core that is used to build the application. No installation or prerequisites are required from the user.

Downsides of self-contained deployments are that an own package is needed for each Operating System platform (_win_, _osx_, _linux_, ...) and for each architecture (_x64_, _x32_, _arm_, ...). E.g. _win-x64_, _linux-x64_. Before _.NET Core 2.0_ deployments had to define distribution and version, instead of platform, e.g. _ubuntu-10.4-x64_. Check available identifiers from [.NET Core Runtime IDentifier (RID) catalog](https://docs.microsoft.com/en-us/dotnet/core/rid-catalog).

Deployment package size is still quite large, around 80MB, as lots of dlls are packed in that are not actually needed by the application. When the new [Linker](https://github.com/dotnet/announcements/issues/30) is released, package size should reduce significantly.

### Setup

Modify __csproj__-file by adding __RuntimeIdentifiers__ to the same __PropertyGroup__ where the __TargetFramework__-element is. __RuntimeIdentifiers__ must list all runtimes self-contained deployment is created.

This example has 3 runtime identifiers:

* __win-x64__
* __osx-x64__
* __linux-x64__

__PropertyGroup__ might also contain other elements that are not in the example below.

```xml
<PropertyGroup>
    <TargetFramework>netcoreapp2.0</TargetFramework>
    <RuntimeIdentifiers>win-x64;osx-x64;linux-x64</RuntimeIdentifiers>
</PropertyGroup>
```

Execute the publish-command from the command line.

```sh
$ dotnet publish -c release -r osx-x64
$ dotnet publish -c release -r linux-x64
```

Packages can be created for any runtime on any operating system, e.g. Linux and macOS deployments can be created on Windows machine and vice versa.

E.g. on .NET Core 2.0 __linux-x64__ files are published to the directory: `\bin\release\netcoreapp2.0\linux-x64\publish`

The root of the directory has files that are not needed for the self-contained deployment. The publish-folder contains all required files.

__Note:__ When a package is released for __Linux__ or __macOS__, it is recommended to archive files first with __tar__ and then compress it with __gzip__. That is because of Unix pipelining philosophy. When releasing a package for __Windows__ compress files with __zip__ or __7zip__.

__Example csproj__-file from FakeServer: [FakeServer.csproj](https://github.com/ttu/dotnet-fake-json-server/blob/master/FakeServer/FakeServer.csproj#L5)

__Example release script__-file from FakeServer: [release.bat](https://github.com/ttu/dotnet-fake-json-server/blob/master/release.bat) and [release.sh](https://github.com/ttu/dotnet-fake-json-server/blob/master/release.sh)

### How To Use Self-Contained Deployments

In this example we use [.NET Fake JSON Server](https://github.com/ttu/dotnet-fake-json-server/)'s binaries. Self-contained deployment archives have been uploaded to repository's [releases](https://github.com/ttu/dotnet-fake-json-server/releases).

OS| File name
---|---:
macOs | fakeserver-osx-x64.tar.gz
Linux | fakeserver-linux-x64.tar.gz
Windows | fakeserver-win-x64.7z

Commands for _Linux_ users to download the file, unarchive the package and execute the binary. At the time of this post version 0.6.0 was the latest released version.

```sh
$ mkdir FakeServer && cd FakeServer
$ wget https://github.com/ttu/dotnet-fake-json-server/releases/download/0.6.0/fakeserver-linux-x64.tar.gz
$ tar -zxvf fakeserver-linux-x64.tar.gz
$ chmod +x FakeServer
$ ./FakeServer
```

### Links

* [Microsoft Docs: Self-Contained Deployments](https://docs.microsoft.com/en-us/dotnet/core/deploying/#self-contained-deployments-scd)
* [.NET Core Runtime IDentifier (RID) catalog](https://docs.microsoft.com/en-us/dotnet/core/rid-catalog)
* [Microsoft Docs: dotnet publish Command](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-publish?tabs=netcore2x)