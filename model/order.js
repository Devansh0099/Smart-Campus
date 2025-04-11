const mongoose=require("mongoose")

const schmea=new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    menu:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Menu"
    },
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","reject","accepted"],
        default:"pending",
    },
    tracking:{
        type:String,
        enum:["completed","processing"],
        default:"processing"
    },
    completedAt:{
        type:Date,
    },
    uniqueCode:{
        type:String
    },
    rating:{
        type:Number,
    }
},{timestamps:true})

const Order=mongoose.model("Order",schmea)
module.exports=Order;