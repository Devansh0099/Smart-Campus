const {Router}=require("express")
const findRouter=Router()
const multer=require("multer")
const path=require("path")
const product = require("../model/lostfound")
const { restrict } = require("../authentication/auth")
const axios=require("axios")
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

const analyzeSentiment = async (text) => {
    const apiUrl = `https://prod.api.market/api/v1/apileague/detect-sentiment/detect-sentiment?text=${encodeURIComponent(text)}`;
    const apiKey = "cm9b00cb9000ljm04bor9awsk";  
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "accept": "application/json",
          "x-magicapi-key": apiKey,  
        },
      });
  
      
      const sentiment = response.data.document.sentiment;  
      const confidence = response.data.document.confidence; 
  
      return { sentiment, confidence };  
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return { sentiment: "neutral", confidence: 0 };  
    }
  };
  

findRouter.get("/",async(req,res)=>{
    const items=await product.find({})
    res.render("lostfound",{items,user:req.user})
})

findRouter.get("/lost-item",async(req,res)=>{
    res.render("lostitem",{user: req.user})
})

findRouter.get("/found-item",async(req,res)=>{
    res.render("founditem",{user: req.user})
})

findRouter.get("/lost-item/:id",async(req,res)=>{
    const item=await product.findById(req.params.id)
    res.render("lostitemvisit",{item,user:req.user})
})



findRouter.post("/lost-item", upload.single('productImage'), async (req, res) => {
    const { productName, location, category, mobileNumber, description } = req.body;
    const productImage = req.file ? `/upload/${req.file.filename}` : null;
    const userId = req.user.id;
  
    const { sentiment, confidence } = await analyzeSentiment(description);
  
    await product.create({
      productName, 
      productImage, 
      location, 
      category, 
      mobileNumber, 
      description, 
      sentiment, 
      confidence,
      userId
    });
  
    return res.redirect("/lf");
  });
  

findRouter.post("/found-item",upload.single('productImage'),async(req,res)=>{
    const {productName,location,category,mobileNumber,description}=req.body;
    const productImage = req.file ? `/upload/${req.file.filename}` : null;
    const userId=req.user.id;
    const { sentiment, confidence } = await analyzeSentiment(description);
    await product.create({
        productName,productImage,location,category,mobileNumber,description,userId,description, 
        sentiment,
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