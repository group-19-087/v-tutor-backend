var express = require('express');
var router = express.Router();
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (request, file, callback){
      callback(null, 'uploads/');
  }, 
  filename: function(request, file, callback){
      callback(null, file.originalname);
  }
}); 

var upload = multer({ storage: storage })

router.get('/', function(req, res, next) {
  res.send('route to get video resources');
});

router.post('/upload', upload.single('file'), function (req, res, next) {
  // req.file is the file
  console.log(req.file);
  res.send('Your file' + req.file.originalname + ' was uploaded'); 
})



module.exports = router;
