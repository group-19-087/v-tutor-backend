var express = require('express')
var router = express.Router()

var matcherRouter = require('./matcher')
var userRouter = require('./user')
var moduleRouter = require('./modules')
var metaDataRouter = require('./metadata')
var jobsRouter = require('./jobs')

router.use('/match', matcherRouter)
router.use('/user', userRouter)
router.use('/modules', moduleRouter)
router.use('/metadata', metaDataRouter)
router.use('/jobs', jobsRouter)

module.exports = router
