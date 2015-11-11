# ghooks [![Build Status](https://travis-ci.org/gtramontina/ghooks.svg?branch=master)](https://travis-ci.org/gtramontina/ghooks) [![Dependencies status](https://david-dm.org/gtramontina/ghooks/status.svg?theme=shields.io)](https://david-dm.org/gtramontina/ghooks#info=dependencies) [![Dev Dependencies status](https://david-dm.org/gtramontina/ghooks/dev-status.svg?theme=shields.io)](https://david-dm.org/gtramontina/ghooks#info=devDependencies)

[![Join the chat at https://gitter.im/gtramontina/ghooks](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gtramontina/ghooks?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Simple git hooks

## Installation

```
npm install ghooks --save-dev
```

_It is not advised to install `ghooks` as a production dependency, as it will install git hooks in your production environment as well. Please install it under the `devDependencies` section of your `package.json`._

## Setup
Add a `config.ghooks` entry in your `package.json` and simply specify which git hooks you want and their corresponding commands, like the following:

```
{
  …
  "config": {
    "ghooks": {
      "pre-commit": "gulp lint",
      "commit-msg": "validate-commit-msg $1",
      "pre-push": "make test",
      "post-merge": "npm install",
      "post-rewrite": "npm install",
      …
    }
  }
  …
}
```

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

This is licensed under the feel-free-to-do-whatever-you-want-to-do license – [http://unlicense.org](http://unlicense.org)
