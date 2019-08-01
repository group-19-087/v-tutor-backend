var express = require('express');
var router = express.Router();
var controller = require('../../controllers/UserController');

router.post('/',function(req,res){
    controller.addUser(req.body).then(function(data){
        res.status(data.status).send({message:data.message});
    }).catch(function(err){
        res.status(err.status).send({message:err.message});
    })
});

router.put('/:id', function(req,res){
    controller.updateUser(req.params.id, req.body).then(function(data){
        res.status(data.status).send({message : data.message});
    }).catch(function(err){
        res.status(err.status).send({message: err.message});
    })
});

router.get('/',function(req,res){
    controller.getAll().then(function(data){
        res.status(data.status).send({message: data.message});
    }).catch(function(err){
        res.status(err.status).send({message: err.message});
    })
});

module.exports = router;
