'use strict'

var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()

var describe = lab.describe
var it = lab.it
var beforeEach = lab.beforeEach
var expect = Code.expect

var Varo = require('..')


describe('Varo', function () {
  var varo

  beforeEach(function (done) {
    varo = Varo()
    done()
  })

  it('works as expected', function (done) {
    varo.handle({role:'test'}, function (msg, done) {
      expect(msg).to.deep.equal({role:'test'})
      return done(null, true)
    })

    varo.observe({role:'test'}, function (msg) {
      expect(msg).to.deep.equal({role:'test'})
    })

    varo.act({role:'test'}, function (err, reply) {
      expect(err).to.equal(null)
      expect(reply).to.equal(true)
    })

    done()
  })

  it('deep matching is supported', function (done) {
    varo.handle({role:'test', txt: {foo: /.*/}}, function (msg, done) {
      expect(msg).to.deep.equal({role:'test', txt: {foo: 'bar'}})
      return done(null, true)
    })


    varo.act({role:'test', txt: {foo: 'bar'}}, function (err, reply) {
      expect(err).to.equal(null)
      expect(reply).to.equal(true)
    })

    done()
  })

  it('observes as expected', function (done) {
    var observeCount = 0

    varo.observe({role:'test'}, function (msg) {
      observeCount += 1
    })

    varo.observe({role:'test'}, function (msg) {
      observeCount += 1
    })

    varo.emit({role: 'test'})
    varo.emit({role: 'test', foo: 'bar'})


    expect(observeCount).to.equal(4)

    done()
  })

  it('works as expected', function (done) {
    varo.handle({role:'test'}, function (msg, done) {
      expect(msg).to.deep.equal({role:'test', left: 3, right: 3})
      return done(null, true)
    })

    varo.act({role:'test', left: 3, right: 3}, function (err, reply) {
      expect(err).to.equal(null)
      expect(reply).to.equal(true)
    })

    done()
  })

  it('patterns are matched fully, not partially', function (done) {
    varo.handle({role: 'auth', cmd: 'login'}, function (msg, done) {
      expect(msg).to.deep.equal({role: 'auth', cmd: 'login'})
      return done(null, true)
    })

    varo.handle({role: 'auth', query: 'isAuthenticated'}, function (msg, done) {
      expect(msg).to.deep.equal({role: 'auth', query: 'isAuthenticated'})
    })

    varo.act({role: 'auth', cmd: 'login'})
    varo.act({role: 'auth', query: 'isAuthenticated'})

    done()
  })

  it('matches happen by depth by default', function (done) {
    var login = false
    var logout = false

    varo.handle({role: 'auth', cmd: 'login'}, function (msg, done) {
      expect(msg).to.deep.equal({role: 'auth', cmd: 'login'})
      login = true
      return done(null)
    })

    varo.handle({role: 'auth', cmd: 'logout'}, function (msg, done) {
      delete msg.token
      expect(msg).to.deep.equal({role: 'auth', cmd: 'logout'})
      logout = true
      return done(null)
    })

    varo.handle({role: 'auth', query: 'is-authorized'}, function (msg, done) {
      return done(null)
    })

    varo.act({role: 'auth', cmd: 'login'})
    varo.act({role: 'auth', cmd: 'logout', token: 'foo'})

    expect(login).to.be.true()
    expect(logout).to.be.true()

    done()
  })
})
