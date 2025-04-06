const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },

    deadline:{
        type:Date,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
},{timestamps:true})

const assignment=mongoose.model("assignment",schema)

module.exports=assignment;