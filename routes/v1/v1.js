var express = require('express')
var router = express.Router()

var videoRouter = require('./videos')
var userRouter = require('./user')
var moduleRouter = require('./modules')
var metaDataRouter = require('./metadata')
var jobsRouter = require('./jobs')

router.use('/videos', videoRouter)
router.use('/user', userRouter)
router.use('/modules', moduleRouter)
router.use('/metadata', metaDataRouter)
router.use('/jobs', jobsRouter)

module.exports = router
