const jwt = require('jsonwebtoken')
const CustomAPIError = require('../error/custom-error')
const Users = require('../model/reg/regMongo.js');
const authorizationMiddleware = async (req,res,next) => {
    const token = req.headers.authorization
    if (!token)
    {
        throw new CustomAPIError('Not Authorized Access Token Not existed',401)
    }
    try 
    {
    const decoded = jwt.verify(token,process.env.SECRET)
    const user = await Users.findOne({email: decoded.email})
    req.user = user
    
    } 
    catch (error) 
    {
        throw new  CustomAPIError('Not Authorized Access Invalid Token',401)
    }
    next()
} 


module.exports = authorizationMiddleware