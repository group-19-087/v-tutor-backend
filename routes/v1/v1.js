var express = require('express');
var router = express.Router();

var videoRouter = require('./videos');

router.use('/videos', videoRouter);

module.exports = router;