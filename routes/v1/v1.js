var express = require('express')
var router = express.Router()

var videoRouter = require('./videos')
var userRouter = require('./user')
var moduleRouter = require('./modules')

router.use('/videos', videoRouter)
router.use('/user', userRouter)
router.use('/modules', moduleRouter)

module.exports = router
