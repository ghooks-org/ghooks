# ghooks [![Build Status](https://travis-ci.org/gtramontina/ghooks.svg?branch=master)](https://travis-ci.org/gtramontina/ghooks) [![Dependencies status](https://david-dm.org/gtramontina/ghooks/status.svg?theme=shields.io)](https://david-dm.org/gtramontina/ghooks#info=dependencies) [![Dev Dependencies status](https://david-dm.org/gtramontina/ghooks/dev-status.svg?theme=shields.io)](https://david-dm.org/gtramontina/ghooks#info=devDependencies)

Simple git hooks

[![NPM](https://nodei.co/npm/ghooks.png?compact=true)](https://nodei.co/npm/ghooks/)

## Installation

```
npm install ghooks --save-dev
```

_It is not advised to install `ghooks` as a production dependency, as it will install git hooks in your production environment as well. Please install it under the `devDependencies` section of your `package.json`._

## Setup
Add a `config.hooks` entry in your `package.json` and simply specify which git hooks you want and their corresponding commands, like the following:

```
{
  …
  "config": {
    "ghooks": {
      "post-update": "make post.update",
      "pre-applypatch": "make pre.applypatch",
      "pre-commit": "node_modules/.bin/gulp lint",
      "pre-push": "make test",
      "pre-rebase": "make pre.rebase",
      "update": "make install"
    }
  }
  …
}
```

## Credits
This module is heavily inspired by [__@nlf__](https://github.com/nlf)'s [precommit-hook](https://www.npmjs.org/package/precommit-hook)

## License
This is licensed under the feel-free-to-do-whatever-you-want-to-do license – [http://unlicense.org](http://unlicense.org)
