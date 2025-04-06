const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    eventName:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    totalSeat:{
        type:Number,
        required:true
    },
    count:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    date:{
        type:Date,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},{timestamps:true})

const event=mongoose.model("Event",schema)

module.exports=event