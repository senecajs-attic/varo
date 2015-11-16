
var Varo = require('../lib/varo')()

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
