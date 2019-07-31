var express = require('express')
var router = express.Router()

var videoRouter = require('./videos')
var userRouter = require('./user')
var moduleRouter = require('./modules')
var metaDataRouter = require('./metadata')

router.use('/videos', videoRouter)
router.use('/user', userRouter)
router.use('/modules', moduleRouter)
router.use('/metadata', metaDataRouter)

module.exports = router
