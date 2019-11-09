var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.io.emit('hello', {
    msg: 'helloworld'
  })
  res.send('index route')
})

module.exports = router
