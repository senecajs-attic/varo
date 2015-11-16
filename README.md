![logo](https://rawgit.com/senecajs/varo/master/assets/varo-logo.svg)
> pattern matched logic for browser apps

# varo
[![Build Status][travis-badge]][travis-url]
[![Gitter][gitter-badge]][gitter-url]

__varo__ is a _pattern matched logic_ library designed for the browser. varo is designed to
compliment [Seneca][senecajs.org] by providing a similar, albeit, smaller set of API's.

The focus of varo is to provide the ability to compose logic around patterns; it does
not handle transport or any other concerns.

- __Version:__ 0.1.2
- __Node:__ 4, 5
- __Lead Maintainer:__ [Dean McDonnell][lead]
- __License:__ [MIT][]

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].

## Install
To install, simply use npm,

```sh
npm install varo
```

## Test
To run tests, simply use npm:

```sh
npm run test
```

## Quick Example

```js
'use strict'

var Varo = require('varo')()

// First .handle() takes priority unless a more
// specific pattern is matched
Varo.handle({role: 'sum'}, function (msg, done) {
  var answer = msg.left + msg.right

  // Will get printed once per call
  console.log('first act called')

  return done(null, {answer: answer})
})

// Won't be called unless the pattern above was removed
Varo.handle({role: 'sum'}, function (msg, done) {
  var answer = msg.left - msg.right

  return done(null, {answer: answer})
})

// Listen for anything emitted via act
Varo.observe({role: 'sum'}, function (msg) {
  console.log(msg)
})

// Great for messages you care about but don't
// want to respond to
Varo.observe({role: 'sum'}, function (msg) {
  console.log(msg)
})

// Get a response to a message. Handy for asking for data or
// making calculations.
Varo.act({role: 'sum', left: 1, right: 2}, function (err, reply) {
  console.log(reply)
})

// You don't have to use a callback, if you are just emitting events or
// running an handler that doesn't respond then it is ok to leave it out.
Varo.act({role: 'sum', left: 1, right: 2})

```

## API

### .handle(msg, handler(err, reply)) : _this_
Adds a handler for the msg provided. The handler is called when .()act is used.

```js
Varo.handle({role: 'sum'}, function (msg, done) {
  return done(null, {answer: (msg.left - msg.right)})
})
```

### .observe(msg, observer(msg)) : _this_
Adds an observer that listens for any message matching the msg param. The observer is called
when .act() is used. Observers are called in addition to a single applicable handler

```js
Varo.observe({role: 'sum'}, function (msg) {
  console.log(msg)
})
```

### .act(msg [, reply]) : _this_
Sends the provided message to any interested single handler and observers. Calls to act can be
fire and forget or request response as necessary.

```js
Varo.act({role: 'sum', left: 1, right: 2}, function (err, reply) {
  console.log(reply)
})

Varo.act({role: 'sum', left: 1, right: 2})
```

### .plugin(plugin(Varo)) : _this_
Calls the provided function with the current instance of varo. Useful to group functionality
together in modular format.

```js
Varo.plugin(function (varo) {
  varo.handle({role: 'sum'}, function (msg, done) {
    return done(null, {answer: (msg.left + msg.right)})
  })

  varo.observe({role: 'sum'}, function (msg) {
    console.log(msg)
  })
})

Varo.act({role: 'sum', left: 1, right: 2}, function (err, reply) {
  console.log(reply)
})
```

### .removeHandler(handler) : _this_
Removes a named handler. Does not work for anonymous functions.

```js
var handler = function (msg, done) {
  return done(null, {answer: (msg.left + msg.right)})
}

Varo.handle({role: 'sum'}, handler)
Varo.removeHandler(handler)
```

### .removeObserver(observer) : _this_
Removes a named observer. Does not work for anonymous functions.

```js
var observer = function (msg) {
  console.log(msg)
}

Varo.observe({role: 'sum'}, observer)
Varo.removeObserver(observer)
```

## Contributing
The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## License
Copyright (c) 2015, Dean McDonnell and other contributors. <br />
Licensed under [MIT][].

[MIT]: ./LICENSE
[lead]: https://github.com/mcdonnelldean
[Senecajs org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
[@senecajs]: http://twitter.com/senecajs
[senecajs.org]: http://senecajs.org/
[travis-badge]: https://travis-ci.org/senecajs/varo.svg
[travis-url]: https://travis-ci.org/senecajs/varo
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/senecajs/seneca
[github issue]: https://github.com/senecajs/varo/issues
