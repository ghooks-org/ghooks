# Contributing

Thanks for your interest in contributing! Here's a few things to keep in mind when contributing to this project:

This project uses `ghooks` to run `commit-msg` and `pre-commit` hooks.

These hooks are `opt-in` only, so if you want to run them (recommended) then add an `.opt-in` file to the root of the project:

```
pre-commit
commit-msg
```

We do this to make it easier for new comers to contribute and allow experienced contributors avoid pushing stuff that'll break the build.

## semantic-release

We use [semantic-release](http://npm.im/semantic-release) to manage releases. This means we have a convention for our commit messages.
**Please follow [our commit message convention](https://github.com/conventional-changelog/conventional-changelog-angular/blob/ed32559941719a130bb0327f886d6a32a8cbc2ba/convention.md)**
even if you're making a small change. This repository follows the
[How to Write an Open Source JavaScript Library](https://egghead.io/series/how-to-write-an-open-source-javascript-library)
series on egghead.io (by yours truly). See
[this lesson](https://egghead.io/lessons/javascript-how-to-write-a-javascript-library-writing-conventional-commits-with-commitizen?series=how-to-write-an-open-source-javascript-library)
and [this repo](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md)
to learn more about the commit message conventions.

