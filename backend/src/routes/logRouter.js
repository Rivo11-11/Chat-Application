const express = require('express');

const logRouter = express.Router();
const logController = require('../controllers/logController')


// Handling Routes
logRouter.route('/login')
.post(logController.httpLoginUser2);
logRouter.route('/register').post(logController.httpaddNewUser2)
logRouter.route('/avatar').post(logController.httpSetAvatar2)


module.exports = logRouter