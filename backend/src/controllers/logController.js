const path = require('path');
const jwt = require('jsonwebtoken')
const CustomAPIError = require('../error/custom-error')
const Users = require('../model/reg/regMongo.js');
const bcrypt = require('bcrypt');



async function httpLoginUser2(req,res) 
{
    const { email, password } = req.body
    const userInDatabase = await Users.findOne({ email: email });
   
 
    if (userInDatabase) {
       const passwordMatch = await bcrypt.compare(password, userInDatabase.password);
       if (passwordMatch) {
          const token = jwt.sign({email},process.env.SECRET,{expiresIn : '30d'})
          return res.status(200).json({token: token,name : userInDatabase.name})
          
       }
       else 
       {
        throw new CustomAPIError('Wrong Password',403);
       }
       
    }
    throw new CustomAPIError('Email does not exist',403);
   
 }

 async function httpSetAvatar2(req, res) {
   const { image , token} = req.body;
   const decoded = jwt.verify(token,process.env.SECRET)
   await Users.findOneAndUpdate(
       { email: decoded.email},
       { $set: { AvatarImage: image, isAvatarImageSet: true } });
   return res.status(201).json({msg : "Your Avatar has been set"});
   
}
async function httpaddNewUser2(req, res) {
   const {name,email,password} = req.body
   const usernameCheck = await Users.findOne({name: name})
   const emailCheck = await Users.findOne({email: email})
   const hashpassword = await bcrypt.hash(password,10)
  // check on the duplication of an email or an username
  if (usernameCheck || emailCheck)  {
   throw new CustomAPIError('Username or Email is already taken',400)
  }
   await Users.create({
   name : name ,
   email : email,
   password : hashpassword
  })
  const token = jwt.sign({email},process.env.SECRET,{expiresIn : '30d'})
  return res.status(200).json({token});    

}

 




module.exports = {
    
    httpLoginUser2,
    httpaddNewUser2,
    httpSetAvatar2
}
