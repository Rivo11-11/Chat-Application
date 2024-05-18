const express = require('express')
const logRouter = require('./logRouter')
const userRouter = require('./userRouter')
const messageRouter = require('./messageRouter')


const api = express.Router()



api.use('/api',logRouter) 
api.use('/api',userRouter)
api.use('/api',messageRouter)



module.exports = api ;