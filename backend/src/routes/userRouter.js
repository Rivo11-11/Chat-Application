const express = require('express');

const userRouter = express.Router();
const userController = require('../controllers/userController')
const authorizationMiddleware = require('../middlewares/auth')

// Handling Routes
userRouter.route('/user')
.get(authorizationMiddleware,userController.httpGetUser)

userRouter.route('/users')
.get(userController.httpGetUsers)


module.exports = userRouter