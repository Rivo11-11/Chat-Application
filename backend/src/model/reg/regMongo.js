const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        min : 3,
        max : 10
    } ,
    email : {
        type : String ,
        required : true,
        
    } ,
    password : {
        type : String ,
        required : true,
        min : 8
    } ,
  
    isAvatarImageSet :{
        type : String ,
        default : false ,
        
    },
    AvatarImage : {
        type : String, 
        default : ""
    }
   
   
});


module.exports = mongoose.model('Users',usersSchema)