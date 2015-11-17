'use strict'

var Parallel = require('fastparallel')()
var Bloomrun = require('bloomrun')

var internals = {}

internals.varo = function () {
  if (!(this instanceof internals.varo)) {
    return new internals.varo()
  }

  this.handlers = Bloomrun()
  this.observers = Bloomrun()
}

internals.varo.prototype.act = function (msg, done) {
  var handler = this.handlers.lookup(msg)
  var observers = this.observers.list(msg)

  done = done || function () { }

  function next (observer, done) {
    observer(msg)
    done()
  }

  function complete (err) {
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

  return Parallel(this, next, observers, complete)
}

internals.varo.prototype.plugin = function (plugin) {
  plugin(this)
  return this
}

internals.varo.prototype.handle = function (msg, handler) {
  this.handlers.add(msg, handler)
  return this
}

internals.varo.prototype.observe = function (msg, observer) {
  this.observers.add(msg, observer)
  return this
}

internals.varo.prototype.removeHandler = function (msg, handler) {
  this.handlers.remove(msg, handler)
  return this
}

internals.varo.prototype.removeObserver = function (msg, observer) {
  this.observers.remove(msg, observer)
  return this
}

module.exports = internals.varo
