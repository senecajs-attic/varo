'use strict'

var Varo = require('../lib/varo')()

var Plugin = function (varo) {
  varo.handle({role: 'sum'}, function (msg, done) {
    return done(null, {answer: (msg.left + msg.right)})
  })

  varo.observe({role: 'sum'}, function (msg) {
    console.log(msg)
  })
}

Varo.plugin(Plugin)
Varo.act({role: 'sum', left: 1, right: 2}, function (err, reply) {
  if (err) return console.error(err)
  console.log(reply)
})
