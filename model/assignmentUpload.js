const mongoose=require('mongoose')
const assignment = require('./assignment')

const schema=new mongoose.Schema({
    pdf:{
        type:String,
        required:true
    }
    ,
    submittedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"assignment"
    },
    date:{
        type:Date,
        required:true
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    }
})

const assignmentUpload=mongoose.model("assignmentUpload",schema)

module.exports=assignmentUpload;
