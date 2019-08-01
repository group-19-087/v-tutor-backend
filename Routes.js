var express = require('express');
var Routes = express.Router();
var UserRoutes = require('./routes/v1/UserRoutes');

Routes.use('/user/', UserRoutes);
module.exports = Routes;
