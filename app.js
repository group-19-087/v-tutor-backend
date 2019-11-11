var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var util = require('./util')
var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectId;

var jwt = require('./helpers/jwt')

require('dotenv').config()

// routes
var indexRouter = require('./routes/index')
var v1Router = require('./routes/v1/v1')

var app = express()

// socket.io
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use(logger('dev'))
app.use(util.overrideContentType())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// create a cors middleware
app.use(function (req, res, next) {
  // set headers to allow cross origin request.
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Content-Length, cdap-projection-values, cdap-search-string, ' +
        'Accept, security-token, x-amz-sns-message-type, x-amz-sns-message-id, x-amz-sns-topic-arn')
  next()
})

app.use((req, res, next) => {
    res.io = io
    next()
})

// app.use(jwt());
var mongoUser = process.env.MONGO_USER
var mongoPass = process.env.MONGO_PASSWORD


mongoose.connect('mongodb://'+ mongoUser +':'+ mongoPass +
    '@cluster0-shard-00-00-phute.mongodb.net:27017,'+
    'cluster0-shard-00-01-phute.mongodb.net:27017,'+
    'cluster0-shard-00-02-phute.mongodb.net:27017/'+
    'test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', 
{useNewUrlParser: true}).then(() =>{
    const db = mongoose.connection;
    console.log("Connection successful");
    var a = "subStatuses.code";
    // Targeted change event
    const targetedChange = [
        {
            $match: {
                $and: [
                    {$or:[{ "updateDescription.updatedFields.codeStatus": "done" },
                        { "updateDescription.updatedFields.slidesStatus": "done" },
                        { "updateDescription.updatedFields.topicsStatus": "done" },
                        { "updateDescription.updatedFields.questionsStatus": "done" }]
                    },
                    { operationType: "update" }
                ]

            }
        }
    ];

    // Creating a change stream on metadatas collection

    const collection = db.collection('metadatas');
    const changeStream = collection.watch(targetedChange);
    // start listen to changes
    changeStream.on("change", function(event) {
        let changeEvent = JSON.parse(JSON.stringify(event));
        var id = new ObjectId(changeEvent.documentKey._id);

        // Retrieving document by id of the updated document
        collection.findOne({_id: id}).then(function(doc) {
            if(doc){
                // Checking whether all 4 processes are done
                if(doc.codeStatus === "done" && doc.slidesStatus === "done" &&
                    doc.topicsStatus === "done" && doc.questionsStatus === "done"){
                    // Updating main status to review
                    collection.update({_id: id},{$set: {status : "review"}}, {w:1}, function(err, result) {
                        if (err) {
                            console.log('Error updating status: ' + err);
                        } else {
                            console.log('' + result + ' document(s) updated');
                            // TODO: SEND SOCKET.IO MESSAGE TO FRONTEND
                        }
                    })
                }
            }

        });
        console.log(JSON.stringify(event));

        // io.on('connection', (socket) => {
        //     socket.emit('hello', {
        //         msg: 'helloworld'
        //     })
        // })
    });
})
    .catch((err) => {
        console.log('Unable to connect to mongoose instance ' + err);
    });

app.use('/', indexRouter)
app.use('/v1', v1Router)

module.exports = {app, server}
