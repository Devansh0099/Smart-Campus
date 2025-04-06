const {Router}=require("express")
const findRouter=Router()
const multer=require("multer")
const path=require("path")
const product = require("../model/lostfound")
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

findRouter.get("/",async(req,res)=>{
    const items=await product.find({})
    res.render("lostfound",{items})
})

findRouter.get("/lost-item",async(req,res)=>{
    res.render("lostitem")
})

findRouter.get("/found-item",async(req,res)=>{
    res.render("founditem")
})

findRouter.get("/lost-item/:id",async(req,res)=>{
    const item=await product.findById(req.params.id)
    res.render("lostitemvisit",{item})
})



findRouter.post("/lost-item",upload.single('productImage'),async(req,res)=>{
    const {productName,location,category,mobileNumber,description}=req.body;
    const productImage = req.file ? `/upload/${req.file.filename}` : null;
    const userId=req.user.id;
    await product.create({
        productName,productImage,location,category,mobileNumber,description,userId
    })
    return res.redirect("/lf");
})

findRouter.post("/found-item",upload.single('productImage'),async(req,res)=>{
    const {productName,location,category,mobileNumber,description}=req.body;
    const productImage = req.file ? `/upload/${req.file.filename}` : null;
    const userId=req.user.id;
    await product.create({
        productName,productImage,location,category,mobileNumber,description,userId
    })
    return res.redirect("/lf");
})

findRouter.put("/lostfound/found/:id",restrict(["admin"]),async(req,res)=>{
    const pro=await product.findById(req.params.id);
    pro.status="Founded"
    pro.save()
    return res.redirect("/lf")
})



module.exports=findRouter;