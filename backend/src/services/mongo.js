const mongoose = require('mongoose') 
require("dotenv").config()

const MongoUrl = process.env.MONGO_URL


// listeners on the connect event
mongoose.connection.once('open',()=>{
    console.log('Mongoose connection established')
})


mongoose.connection.on('error',(err)=>{
    console.error(err)
})


async function connectMongo()
{
   await  mongoose.connect(MongoUrl)
}
async function disconnectMongo()
{
     await mongoose.disconnect()
}
module.exports = {
    connectMongo,
    disconnectMongo,
}