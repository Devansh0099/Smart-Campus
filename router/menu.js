const {Router}=require("express")
const menuRouter=Router()
const path=require("path")
const multer=require("multer")
const Menu = require("../model/menu")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve("./public/menu"))
    },
    filename:function(req,file,cb){
        const filename=`${Date.now()}-${file.originalname}`
        cb(null,filename)
    }
})
const upload = multer({ storage });



const express = require("express");
const router = express.Router();
const Order = require("../model/order"); 


menuRouter.get("/canteen", async (req, res) => {
    const userId = req.user._id; 
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.render("canteen", { user: req.user, orders });
});

module.exports = router;


menuRouter.get("/",async(req,res)=>{
    const menu=await Menu.find({})
    res.render("menu",{user:req.user,menu})
})

menuRouter.get("/create",async(req,res)=>{
    res.render("menuCreation",{user: req.user})
})

menuRouter.post("/create",upload.single("image"),async(req,res)=>{
    const {name,description,price,category,available,date}=req.body;
    const image=`/menu/${req.file.filename}`
    await Menu.create({
        name,description,price,category,available,date,image
    })
    return res.redirect("/menu")
})

menuRouter.post("/available/:id",async(req,res)=>{
    const {available}=req.body;
    const id=req.params.id;
    const menu=await Menu.findByIdAndUpdate(id,{available})
    await menu.save()
    return res.redirect("/menu")
})

menuRouter.post('/delete/:id',async(req,res)=>{
    const id=req.params.id;
    const menu=await Menu.findByIdAndDelete(id);
    await menu.save()
    return res.redirect("/menu")
})

module.exports=menuRouter