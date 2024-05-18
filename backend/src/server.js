const http = require('http');
const socket = require('socket.io')
const app =  require('./app');
const {connectMongo} = require('./services/mongo')

require("dotenv").config()

const PORT = process.env.PORT 

const server = http.createServer(app)

 // setting up our data before listening to the users .. to ensure to get the data completely in the requests
 async function startserver()
{
    await connectMongo()
    // now i am sure that the listen will be after the data is completed
    server.listen(PORT,()=>{
        console.log('listening on port '+PORT);
    });
}
// no code relay on startserver so no need to await startserver
startserver()
const io = socket(server,{
    cors : {
        origin : "http://localhost:3000" ,
        credentials : true
    }
})
global.onlineUsers = new Map() 
io.on('connection',(socket)=>{

    global.chatSocket = socket 
    socket.on('add-user',(userId)=>{
        console.log('user is here ..',userId)
        // a map of map[userId] map to socket.id
        // any user become online emit this event to be inserted in the Map of online users
        onlineUsers.set(userId,socket.id)
        console.log(onlineUsers)
        const onlineUserList = Array.from(onlineUsers.keys()); // Get list of online user IDs
        console.log(onlineUserList)
        io.emit('online-users', onlineUserList);
    })
    socket.on('logout',(userId)=>{
        console.log('user is deleted ..',userId)
        // a map of map[userId] map to socket.id
        // any user become online emit this event to be inserted in the Map of online users
        onlineUsers.delete(userId)
        console.log(onlineUsers)
        const onlineUserList = Array.from(onlineUsers.keys()); // Get list of online user IDs
        console.log(onlineUserList)
        io.emit('online-users', onlineUserList);
    })
    socket.on('send-msg',(data)=>{
        // get the socket.id of the person your are chatting with
        const sendUserSocket = onlineUsers.get(data.to)
        console.log(onlineUsers)
        // if the user is online now 
        if (sendUserSocket) 
        {
            console.log('Yes')
            // send to him the data immediately
            socket.to(sendUserSocket).emit('msg-receive',data.msg,data.to)
        }
    })
})



