# ghooks

[![version](https://img.shields.io/npm/v/ghooks.svg?style=flat-square)](http://npm.im/ghooks)
[![travis build](https://img.shields.io/travis/gtramontina/ghooks.svg?style=flat-square)](https://travis-ci.org/gtramontina/ghooks)
[![codecov coverage](https://img.shields.io/codecov/c/github/gtramontina/ghooks.svg?style=flat-square)](https://codecov.io/github/gtramontina/ghooks)
[![Dependencies status](https://img.shields.io/david/gtramontina/ghooks.svg?style=flat-square)](https://david-dm.org/gtramontina/ghooks#info=dependencies)
[![Dev Dependencies status](https://img.shields.io/david/dev/gtramontina/ghooks.svg?style=flat-square)](https://david-dm.org/gtramontina/ghooks#info=devDependencies)

[![MIT License](https://img.shields.io/npm/l/ghooks.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![downloads](https://img.shields.io/npm/dm/ghooks.svg?style=flat-square)](http://npm-stat.com/charts.html?package=ghooks&from=2014-04-01)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![gitter chat](https://img.shields.io/gitter/room/gtramontina/ghooks.svg?style=flat-square)](https://gitter.im/gtramontina/ghooks)

Simple git hooks

## Installation

```
npm install ghooks --save-dev
```

_It is not advised to install `ghooks` as a production dependency, as it will install git hooks in your production environment as well. Please install it under the `devDependencies` section of your `package.json`._

_Please also note, that it is absolutely **not advised** to install `ghooks` globally. To work as expected, make it a development dependency of your project(s)._

## Setup

Add a `config.ghooks` entry in your `package.json` and simply specify which git hooks you want and their corresponding commands, like the following:

```
{
  …
  "config": {
    "ghooks": {
      "pre-commit": "gulp lint",
      "commit-msg": "validate-commit-msg",
      "pre-push": "make test",
      "post-merge": "npm install",
      "post-rewrite": "npm install",
      …
    }
  }
  …
}
```

## opt-in/out

One of the last things you want is to raise the barrier to contributing to your open source project. So [Andreas Windt](https://github.com/ta2edchimp) developed the [opt-cli](https://npmjs.com/package/opt-cli) package to allow you to turn your hooks into opt-in/out scripts. See this project's [`package.json`](package.json) for an example of how to do that.

## All [documented](http://git-scm.com/docs/githooks) hooks are available:

* applypatch-msg
* pre-applypatch
* post-applypatch
* pre-commit
* prepare-commit-msg
* commit-msg
* post-commit
* pre-rebase
* post-checkout
* post-merge
* pre-push
* pre-receive
* update
* post-receive
* post-update
* pre-auto-gc
* post-rewrite

## Common Issues

* [Usage with git GUI clients](https://github.com/gtramontina/ghooks/issues/18) – Thanks to [@JamieMason](https://github.com/JamieMason)

## Credits
This module is heavily inspired by [__@nlf__](https://github.com/nlf)'s [precommit-hook](https://www.npmjs.org/package/precommit-hook)

## Contributors

Huge thanks to everyone listed [here](https://github.com/gtramontina/ghooks/graphs/contributors)!

## License

This software is licensed under the MIT license
