const mongoose=require("mongoose")
const express=require("express")
const path=require("path")
const cookieParser=require("cookie-parser")
const { auth } = require("./authentication/auth")
const userRouter = require("./router/userRoute")
const findRouter = require("./router/lostfound")
const messageRouter = require("./router/message")
const eventRouter = require("./router/event")
const assignRouter = require("./router/assignment")
const router = require("./router/chat")
const menuRouter = require("./router/menu")
const orderRouter = require("./router/order")

const session = require("express-session");
const routers = require("./router/nutrition")



const app=express()
mongoose.connect("mongodb://127.0.0.1:27017/Campus").then(()=>{console.log("connect successfully")}).catch((err)=>{console.log(`error:${err}`)})
port=8000

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(
    session({
        secret: "your-secret-key", 
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.static(path.resolve("./public")))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.json())
app.use(auth("token"))


app.use("/user",userRouter)
app.use("/lf",findRouter);
app.use("/message",messageRouter)
app.use("/event",eventRouter)
app.use("/assignment",assignRouter)
app.use("/chat",router)
app.use("/menu",menuRouter)
app.use("/cart",orderRouter)
app.use("/nutrition", routers);

app.get("/",async(req,res)=>{
    console.log("user",req.user)
    res.render("home",{user:req.user || null})
})



app.listen(port,()=>{console.log("server started")})