---
layout: post
title: Use Chocolatey to automate application installations on a Windows development machine
excerpt: Automate application installations with Chocolatey package manager and make onboarding happier for new employees.
---

Do you need an easy way to improve your team's new employee onboarding or just a way to make your life easier? Use _a package manager with Windows_.

Unfortunately Windows doesn't have an official package manager, so many Windows users install applications manually. That habit is rooted deep and for a long time I also used to install all my applications manually when using Windows. Even when I already knew of the existence of _Chocolatey_ and other package managers.

**Update 2022:** Windows has also official package manager [Winget](https://github.com/microsoft/winget-cli). Chocolatey has still larger package repository, so it might still be better option in some cases.

## Chocolatey

[Chocolatey](https://chocolatey.org/) is _a package managers for Windows_. Chocolatey works with all existing software installation technologies like _MSI_, _NSIS_, _InnoSetup_ etc. and also works with runtime binaries and zip archives. Pretty much any application can be installed with Chocolatey.

All available applications are listed at [Chocolatey's home page](https://chocolatey.org/packages).

## Install Chocolatey

Installing Chocolatey is easy. Just copy/paste a single command to Command Prompt.

1. Run Command Prompt as administrator
1. Install Chocolatey

```sh
$ @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

Check full installation instructions from Chocolatey [installation instructions page](https://chocolatey.org/install#installing-chocolatey).

## Install packages with Chocolatey

Before installing the packages it is recommended to install all Windows updates, especially if using older computers with factory installation. Some installations (e.g. _Docker_) might fail if there is too old _Windows_ version.

Some installations recommended to run _Command Prompt_ as administrator.

All packages can be installed with a single command.

```sh
$ choco install -y [app1] [app2] [app3] ...
```

Package names can be found with search from Chocolatey home page or from command line.

```sh
$ choco search [keyword]
```

Example command will install _Cmder, Visual Studio Code, Visual Studio 2017 Professional, Git, Google Chrome, Insomnia, Azure Data Studio, Docker, Notepad++, Putty, WinSCP, NVM, 7zip, Slack, SourceTree, HeidiSQL, Libre Office and WhatsApp_.

```sh
$ choco install -y cmder vscode visualstudio2017professional git googlechrome insomnia-rest-api-client azure-data-studio docker-for-windows notepadplusplus putty winscp nvm 7zip slack sourcetree heidisql libreoffice-fresh whatsapp
```

Most of the applications will install nicely on the background. Some applications might open a window, but those won't prevent other applications from installing. For example, Insomnia opened and SourceTree showed a login window.

Some packages are installed under _Chocolatey's_ `lib` folder, e.g. _Putty_ was installed to `C:\ProgramData\chocolatey\lib\putty.portable\tools` and some are installed to a custom installation path, e.g. _Cmdr_ was installed to to `C:\tools\cmdr`.

Installation of applications in the example took around 20 minutes and in the end Chocolatey displays a list of installed packages:

```sh
Installed:
 - putty v0.70.0.20171219
 - sql-operations-studio v0.23.6
 - vcredist2008 v9.0.30729.6161
 - sourcetree v2.4.7.0
 - libreoffice-fresh v5.4.4
 - 7zip v16.4.0.20170506
 - slack v3.0.0
 - winscp v5.11.3
 - heidisql v9.4.0.5125
 - notepadplusplus v7.5.4
 - chocolatey-core.extension v1.3.3
 - nvm.portable v1.1.5
 - notepadplusplus.install v7.5.4
 - cmder v1.3.3
...
```
 
Installed packages can be later viewed with list command. (_--idonly_ will print only package names)

```sh
$ choco list --local-only --idonly
```

## Export installed packages to another computer

Chocolatey supports installing applications with [packages.config](https://chocolatey.org/docs/commands-install#packagesconfig) file, but unfortunately Chocolatey doesn't have a command to create the config file from local packages.

One easy way to export installed packages is to create a PowerShell script that has an install command for each package.

```sh
PS> choco list --local-only --idonly | % { "choco install -y " + $_ } > Install.ps1
```

Hopefully some day Chocolatey will have a functionality to export packages.config file.

## Upgrade applications with Chocolatey

Besides installing an important feature is upgrading. All applications installed with Chocolatey can be upgraded with a single command:

```sh
$ cup -y all
```

Naturally some applications have automatic upgrades, but Chocolatey will notice if a newer versions is already installed and it will skip the upgrade for that application.

```sh
redis-desktop-manager v0.8.0.3840 is the latest version available based on your source(s).
SkypeForBusiness v16.0.78702031 is newer than the most recent.
 You must be smarter than the average bear...
slack v3.2.0 is the latest version available based on your source(s).
vlc v3.0.3 is the latest version available based on your source(s).
vscode v1.25.1 is the latest version available based on your source(s).
WhatsApp v0.3.225 is the latest version available based on your source(s).
winscp v5.13.3 is the latest version available based on your source(s).
winscp.install v5.13.3 is the latest version available based on your source(s).

Chocolatey upgraded 1/50 packages. 1 packages failed.
 See the log for details (C:\ProgramData\chocolatey\logs\chocolatey.log).

Upgraded:
 - libreoffice-fresh v6.0.6
 
Packages requiring reboot:
 - libreoffice-fresh (exit code 3010)

The recent package changes indicate a reboot is necessary.
 Please reboot at your earliest convenience.
 
Failures
 
 - linqpad5.install (exited 1) - linqpad5.install not upgraded. An error occurred during installation:
 Updating 'linqpad5.install 5.31.0' to 'linqpad5.install 5.31.0.20180720' failed. Unable to find a version of 'linqpad5' that is compatible with 'linqpad5.install 5.31.0.20180720'.  
```

Sometimes failures are errors in the installation scripts and those are usually fixed pretty fast. In case of errors, check conversations from that package's Chocolatey page. ([LINQPad](https://chocolatey.org/packages/linqpad5.install) from the example)

## Other important installations that can be installed from command line

Extensions for Visual Studio and VS Code can also be installed from command line. Especially installation of VS Code extensions is extremely easy.

```sh
$ code --install-extension ms.python.python
```

* [Visual Studio Extensions](https://stackoverflow.com/a/30574978/1292530)
* [VS Code Extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_command-line-extension-management)

## Things to do manually

There might still be some things that have to be installed manually, but when Chocolatey handles most of the bulk installations few manual installations do not feel so bad.

#### Visual Studio

Even when _Visual Studio_ is installed with _Chocolatey_, I install required packages manually with _Visual Studio Installer_. This way I can choose better what I want to install. All packages can be installed automatically by using different [parameters](https://docs.microsoft.com/en-us/visualstudio/install/use-command-line-parameters-to-install-visual-studio?view=vs-2017) and component identifier.

E.g. Install VS Professional with Git component pre-istalled.
```sh
$ choco install -y visualstudio2017professional --package-parameters="'--add Microsoft.VisualStudio.Component.Git'"
```

Microsoft has a nice collection of PowerShell scripts to setup whole develop box in GitHub repository [windows-dev-box-setup-scripts](https://github.com/Microsoft/windows-dev-box-setup-scripts).

From there you can check more examples how Visual Studio is [installed with Chocolatey](https://github.com/Microsoft/windows-dev-box-setup-scripts/blob/ee2a2cf65bfe76b915bf02d3e5475e7dccc51aa8/dev_app.ps1#L39).

#### SQL Server

_SQL Server_ installation can be skipped completely as it works nicely with [Docker](https://www.hanselman.com/blog/SQLServerOnLinuxOrInDockerPlusCrossplatformSQLOperationsStudio.aspx). At least most of the time.

#### Windows Subsystem for Linux

Windows Subsystem for Linux is also easiest to install manually ([WSL Windows 10 install guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10)).

## Other package manager

If you are not fan of Chocolatey, there are other package managers available:

* [PowerShell Package Management](https://docs.microsoft.com/en-us/powershell/module/packagemanagement/)
* [Scoop](https://scoop.sh/)
* [Ninite](https://ninite.com/)

## Summary

If you can automate fully or partially the computer setup for new employees, at least that part of the employee onboarding will be much more pleasant, as new employees don't have to use the first day to download setup-packages and clicking through setup windows.

Naturally some may want to install applications manually or however they are used to. Still they can benefit from the setup scripts as they can check all required applications from the scripts.

If you want to take things even further you can check [BoxStarter](https://boxstarter.org/) and [setup scripts from Microsoft](https://github.com/Microsoft/windows-dev-box-setup-scripts).

All in all, getting started with fresh OS installation by installing apps with package manager is much more comfortable than using lots of time with manual installations.