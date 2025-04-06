const {Router}=require("express")
const message = require("../model/message")
const messageRouter=Router()
const path=require("path")
const multer=require("multer")
const { restrict } = require("../authentication/auth")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve("./public/upload"))
    },
    filename:function(req,file,cb){
        const filename=`${Date.now()}-${file.originalname}`
        cb(null,filename)
    }
})
const upload = multer({ storage });

messageRouter.get("/",async(req,res)=>{
    res.render("message")
})

messageRouter.get("/show",async(req,res)=>{
    const issues=await message.find({})
    res.render("showmess",{issues})
})

messageRouter.post("/create",upload.single("image"),async(req,res)=>{
    const {content,email,category,title,location}=req.body;
    const image=req.file ? `/message/${req.file.filename}` : null
    await message.create({
        content,email,category,image,title,location
    }) 
    return res.redirect("/message")
}
)

messageRouter.post("/status/:id",async(req,res)=>{
    const {id}=req.params;
    const {status}=req.body
    await message.findByIdAndUpdate(id,{status})
    return res.redirect("/message/")
})

messageRouter.post("/delete/:id",async(req,res)=>{
    await message.findByIdAndDelete(req.params.id)
})

// restrict("admin"),

module.exports=messageRouter
