const mongoose=require('mongoose')

const schema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    date:{
        type:Date,
        required:true
    }
},{timestamps:true})

const bookingEvent=mongoose.model("bookingEvent",schema);

module.exports=bookingEvent