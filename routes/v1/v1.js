var express = require('express');
var router = express.Router();

var videoRouter = require('./videos');
var userRouter = require('./user');

router.use('/videos', videoRouter);
router.use('/user', userRouter);

module.exports = router;