'use strict'

var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()

var describe = lab.describe
var it = lab.it
var beforeEach = lab.beforeEach
var expect = Code.expect

var Varo = require('..')

var BloomrunLookup = require('bloomrun').prototype.lookup

describe('Varo - errors handling', function () {
  var varo

  beforeEach(function (done) {
    varo = Varo()
    done()
  })

  it('null bloomrun handler', function (done) {
    var hit = false
    varo.handle({role: 'test'}, function (msg, done) {
      expect(msg).to.deep.equal({role: 'test'})
      hit = true
      return done(null, true)
    })

    require('bloomrun').prototype.lookup = function (pattern, opts) {
      return null
    }

    varo.act({role: 'test'})

    setTimeout(function(){
      expect(hit).to.equal(false)
      require('bloomrun').prototype.lookup = BloomrunLookup
      done()
    }, 111)
  })

  it('handler returns error', function (done) {
    varo.handle({role: 'test'}, function (msg, done) {
      expect(msg).to.deep.equal({role: 'test'})
      return done(new Error('test error'))
    })

    varo.act({role: 'test'})

    done()
  })
})
