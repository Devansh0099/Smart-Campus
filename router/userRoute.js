const {Router}=require("express")
const user = require("../model/user")
const userRouter=Router()

userRouter.get("/signup",(req,res)=>{
    res.render("signup")
})

userRouter.get("/signin",(req,res)=>{
    console.log("GET /user/signin hit");
    res.render("signin")
})

userRouter.post("/signup",async(req,res)=>{
    const {name,email,password,role}=req.body;
    const u=await user.create({
        name,
        email,
        password,
        role
    })

    u.save()
    return res.redirect("/user/signin")
})

userRouter.post("/signin",async(req,res)=>{
    const {email,password}=req.body;
    const token=await user.matchpassword(email,password)
    return res.cookie("token",token).redirect("/")
})

module.exports=userRouter;
