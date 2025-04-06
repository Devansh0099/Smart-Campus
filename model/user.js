const mongoose=require("mongoose")
const bcrypt=require("bcrypt");
const { createToken } = require("../services/service");

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["student","admin","teacher"],
        default:"student"
    }
},{timestamps:true})

schema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    return next()
})

schema.static("matchpassword",async function(email,password){
    const user=await this.findOne({email})
    if(!user){
        throw new Error("No User")
    }
    const isPassword=await bcrypt.compare(password,user.password)
    if(!isPassword){
        throw new Error("Invliad Password");
    }
    const token=createToken(user)
    return token;
})

const user=mongoose.model("User",schema)

module.exports=user