const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productImage:{
        type:String
    },
    location:{
        type:String,
    },sentiment: String,
    confidence: String,
    category:{
        type:String,
        enum:["lost","found"]
    },
    description:{
        type:String,
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    }
    ,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const product=mongoose.model("product",schema)

module.exports=product;