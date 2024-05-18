const express = require('express');

const messageRouter = express.Router();
const messageController = require('../controllers/messageController')

// Handling Routes
messageRouter.route('/addmsg')
.post(messageController.httpAddMessage);

messageRouter.route('/getmsg')
.post(messageController.httpGetAllMessage);




module.exports = messageRouter