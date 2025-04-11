const {Router}=require("express")
const Menu = require("../model/menu")
const Order = require("../model/order")
const { sendOrderCompletedMail } = require("../utils/email")
const orderRouter=Router()

orderRouter.use((req,res,next)=>{
    if(!req.session.cart){
        req.session.cart=[]
    }
    next()
})

const generateUniqueCode = () => {
    return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  

orderRouter.post("/",async(req,res)=>{
    const {id}=req.body;
    const menu=await Menu.findById(id);
    console.log(menu)
    req.session.cart.push({
        id: menu._id,
        image: menu.image,
        title: menu.name,
        price: menu.price
      });
      res.redirect("/menu");
})

orderRouter.get("/cart", (req, res) => {
    const cart = req.session.cart || [];
    res.render("cart", { cart,user:req.user });
  });

  orderRouter.get("/checkout", (req, res) => {
    const cart = req.session.cart || [];
    res.render("checkout", { cart });
  });

orderRouter.post("/checkout",async (req,res)=>{
    const {name,email,mobile}=req.body;
    const userId = req.user.id
    const order=req.session.cart.map(item=>({
        user:userId,
        menu:item.id,
        name,
        email,mobile
    }))
    await Order.insertMany(order)
    req.session.cart=[]

    return res.redirect("/menu")
})

orderRouter.get("/admin/order",async(req,res)=>{
    const orders=await Order.find({}).populate("user").populate("menu");
    console.log(orders)
    res.render("admin",{orders,user:req.user.id})
})

orderRouter.post("/update/status/:id",async(req,res)=>{
    const {status}=req.body
    const order=await Order.findByIdAndUpdate(req.params.id,{status})
   
    await order.save()
    console.log(order)
    return res.redirect("/cart/admin/order")
})

orderRouter.post("/update/tracking/:id",async(req,res)=>{
    const {tracking}=req.body
    const order=await Order.findById(req.params.id).populate("user")
    order.tracking=tracking
    if(order.tracking==="completed"){
        order.uniqueCode=generateUniqueCode()
        order.createdAt=Date.now()
    }
    await order.save()
    console.log(order)
    alert("email send")
    return res.redirect("/cart/admin/order")
})

orderRouter.post("/rateorder/:id",async(req,res)=>{
    const {rating}=req.body;
    const order=await Order.findById(req.params.id)
    order.rating=rating;
    await order.save()
    return res.redirect("/menu")
})



module.exports=orderRouter

