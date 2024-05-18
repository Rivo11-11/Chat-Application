const jwt = require('jsonwebtoken')
const CustomAPIError = require('../error/custom-error')
const Users = require('../model/reg/regMongo')


async function httpGetUser(req, res) {
        const { name, AvatarImage, _id } = req.user;
        return res.status(200).json({name,AvatarImage,_id});
}

async function httpGetUsers(req, res) {
  const token = req.headers.authorization;
  if (!token) {
    throw new CustomAPIError('Unauthorized Access',401) // Unauthorized.. no token
  }
  const decoded = jwt.verify(token,process.env.SECRET)
  const users = await Users.find(
    { email: { $ne: decoded.email } }, // Query
    { name: 1, AvatarImage: 1} // Projection
    )

  return res.status(200).json(users);
}




module.exports = {
    httpGetUser,
    httpGetUsers,
}