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
})
