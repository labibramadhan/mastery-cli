# MasteryJS Command Line Utility

Command line utility to get started easily on [MasteryJS](https://github.com/labibramadhan/mastery), a scalable REST API framework build on top of Hapi and Sequelize.

[![npm version](https://badge.fury.io/js/mastery.svg)](https://badge.fury.io/js/mastery)
[![Dependency Status](https://david-dm.org/labibramadhan/mastery-cli.svg)](https://david-dm.org/labibramadhan/mastery-cli)
[![devDependency Status](https://david-dm.org/labibramadhan/mastery-cli/dev-status.svg)](https://david-dm.org/labibramadhan/mastery-cli?type=dev)

[API Documentation](https://labibramadhan.github.io/mastery-cli/api/index.html)

## Table of Contents
1. [Main Features](#main-features)
1. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    1. [Installation](#installation)
1. [Commands](#commands)
    1. [Server Management](#server-management)
    1. [CLI Configuration](#cli-configuration)

## Main Features

- [x] Build system for MasteryJS
- [x] PM2 configuration using mastery.run.json file, see [PM2 Process File](http://pm2.keymetrics.io/docs/usage/application-declaration/)
- [x] Server management including start, stop, and reloading MasteryJS production ready package
- [x] Monitor MasteryJS processes using [PM2 Monitoring](http://pm2.keymetrics.io/docs/usage/monitoring/)
- [x] Ability to speak many languages

## Getting Started

### Prerequisites

1. [Git](https://git-scm.com/downloads)
1. [NodeJS](https://nodejs.org/en/download) version 6 or greater

### Installation

#### Windows

Open Command Prompt that you will probably need to run as Administrator. And then, type
```
npm install -g mastery
```

#### MacOS/Linux

```
sudo npm install -g mastery
```

## Commands

### Server Management

#### New
Create a new MasteryJS project, cloning/download the latest source from [MasteryJS repo](https://github.com/labibramadhan/mastery).

**This command can be executed anywhere.**

Usage:
```
mastery new [destination]
```
- **[destination]** is the path where the new project will be.

After that, a wizard will showing and there are some questions to follow.

#### Serve
Turn on MasteryJS directly from the source using [babel-node](https://babeljs.io/docs/usage/cli/#babel-node).

**This command must be executed inside the root of MasteryJS project.**

Usage:
```
mastery serve -i|--inspect -p|--port <n>
```
- **-i, --inspect** enable Chrome Developer Tools Inspector. This argument is optional.

- **-p, --port \<n>** enable --debug-brk feature, to debug using any supported IDE. Fill **\<n>** with a port number.

#### Build
Build a MasteryJS project, this will transform MasteryJS source codes into ES2015 minified codes using babel + uglify.
Also, a mastery.run.json file will be created for the [PM2 needs](http://pm2.keymetrics.io/docs/usage/application-declaration/#json-format).
After that, a 'build' directory will exist. You can then deploy this directory.

**This command must be executed inside the root of MasteryJS project.**

Usage:
```
mastery build
```

#### Start
Start MasteryJS server that has been built before using [PM2](http://pm2.keymetrics.io/docs/usage/quick-start/#usage).
By default, the processes spawned are using [cluster mode](http://pm2.keymetrics.io/docs/usage/cluster-mode/).

**This command must be executed inside the build of MasteryJS project.**

Usage:
```
mastery start
```

#### Stop
Stop MasteryJS server.

**This command must be executed inside the build of MasteryJS project.**

Usage:
```
mastery stop
```

#### Restart
Restart MasteryJS server. This will execute the stop and start commands.

**This command must be executed inside the build of MasteryJS project.**

Usage:
```
mastery restart
```

#### Status
Launch [PM2 Process Monitoring](http://pm2.keymetrics.io/docs/usage/monitoring/).

**This command can be executed anywhere.**

Usage:
```
mastery status
```

#### Scale
Scale MasteryJS cluster processes length that currently running.

**This command must be executed inside the build of MasteryJS project.**

Usage:
```
mastery scale [length]
```

- **[length]** is optional. If length is not provided, a question will be prompted to define the length.

### CLI Management

#### Conf
Change CLI configuration [config.json](src/config.js) value and change CLI language as well.

**This command can be executed anywhere.**

Usage:
```
mastery conf [key] [value]
```

- **[key]** Configuration key to change its value.
- **[value]** The new configuration value.

Example for changing the CLI language to Indonesian:
```
mastery conf lang id
```
