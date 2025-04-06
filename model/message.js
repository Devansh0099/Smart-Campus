const mongoose=require('mongoose')

const schema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    title:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    }

})

const message=mongoose.model("message",schema)

module.exports=message;
