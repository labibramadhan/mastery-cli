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
    1. [Running](#running)

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

### Running

To get started, type:
```
mastery --help
```
