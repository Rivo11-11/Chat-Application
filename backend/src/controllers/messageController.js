const CustomAPIError = require('../error/custom-error')
const Messages = require('../model/message/mesMongo');





async function httpAddMessage(req, res) {
        const {from,to,msg} = req.body
        await Messages.create({
            message : {text : msg} ,
            users : [from ,to] ,
            sender : from 
        })
        return res.status(201).json({msg : 'Message Created'});
        
}

async function httpGetAllMessage(req, res) {
    
    const {to,from} = req.body 
    // get all the messages that is sent by to to from 
    // [id:1,id : 2] and [id:2,id:1] to get the messages sent and received 
    // if to and from exist in the array return them 
    const data = await Messages.find({
            users : {
                $all : [to ,from]
            }
        }).sort({updatedAt : 1})
    message = data.map((msg)=> {
        return {
            fromSelf : msg.sender.toString() === from ,
            message : msg.message.text
        }
    })
    return res.status(200).json(message)

    }


module.exports = {
    httpAddMessage ,
    httpGetAllMessage,
}
