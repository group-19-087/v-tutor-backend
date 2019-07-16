var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var util = require('./util');
var jwt = require('./helpers/jwt')

// routes
var indexRouter = require('./routes/index');
var v1Router = require('./routes/v1/v1');

var app = express();

app.use(logger('dev'));
app.use(util.overrideContentType());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//create a cors middleware
app.use(function(req, res, next) {
    //set headers to allow cross origin request.
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Content-Length" + 
        "Accept, security-token, x-amz-sns-message-type, x-amz-sns-message-id, x-amz-sns-topic-arn");
        next();
    });

// app.use(jwt());

app.use('/', indexRouter);
app.use('/v1', v1Router);

module.exports = app;
