'use strict'

var Parallel = require('fastparallel')()
var Bloomrun = require('bloomrun')


var Varo = function () {
  if (!(this instanceof Varo)) {
    return new Varo()
  }

  this.handlers = Bloomrun()
  this.observers = Bloomrun()
}

Varo.prototype.act = function (msg, done) {
  var handler = this.handlers.lookup(msg)

  done = done || function () { }

  if (handler) {
    handler(msg, function (err, reply) {
      if (err) {
        return done(err)
      }
      else {
        return done(null, reply)
      }
    })
  }
}

Varo.prototype.emit = function (msg) {
  var observers = this.observers.list(msg)

  function next (observer, done) {
    observer(msg)
    done()
  }

  return Parallel(this, next, observers)
}

Varo.prototype.plugin = function (plugin) {
  plugin(this)
  return this
}

Varo.prototype.handle = function (msg, handler) {
  this.handlers.add(msg, handler)
  return this
}

Varo.prototype.observe = function (msg, observer) {
  this.observers.add(msg, observer)
  return this
}

Varo.prototype.removeHandler = function (msg, handler) {
  this.handlers.remove(msg, handler)
  return this
}

Varo.prototype.removeObserver = function (msg, observer) {
  this.observers.remove(msg, observer)
  return this
}

module.exports = Varo
