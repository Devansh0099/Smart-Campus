const {Router}=require("express")
const message = require("../model/message")
const messageRouter=Router()
const path=require("path")
const multer=require("multer")
const { restrict } = require("../authentication/auth")
const axios=require("axios")
// const SENTIMENT_API_URL = `https://prod.api.market/api/v1/apileague/detect-sentiment/detect-sentiment?text=${encodeURIComponent(content)}`; // Replace with your actual sentiment API URL
const API_KEY = 'cm9b00cb9000ljm04bor9awsk'; 


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
    res.render("message",{user: req.user})
  })

messageRouter.get("/show",async(req,res)=>{
    const issues=await message.find({})
    res.render("showmess",{issues,user:req.user})
})

messageRouter.get("/view/:id",async(req,res)=>{
    const issue=await message.findById(req.params.id)
    console.log(issue)
    res.render("viewmess",{issue,user:req.user})
})


messageRouter.get("/user",async(req,res)=>{
    const issues=await message.find({email:req.user.email})
    console.log("issue",issues)
    res.render("showmess",{issues,user:req.user})
})


messageRouter.post("/create", upload.single('image'), async (req, res) => {
    const { title, location, category, email, content } = req.body;
    const image = req.file ? req.file.filename :null; 
    console.log(title,location)
    try {
      const sentimentApiUrl = `https://prod.api.market/api/v1/apileague/detect-sentiment/detect-sentiment?text=${encodeURIComponent(content)}`;
      const sentimentResponse = await axios.get(sentimentApiUrl, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`  
        }
      });
      if (sentimentResponse.status !== 200) {
        throw new Error("Failed to fetch sentiment data");
      }
      
      const sentimentData = sentimentResponse.data.document;
      const sentiment = sentimentData.sentiment; 
      console.log(sentimentData);  
      let priority;
      if (sentiment === "positive") {
        priority = "Low";  
        priority = "Medium";  
      } else {
        priority = "High"; 
      const newIssue = new message({
        title,
        location,
        category,
        email,
        content,
        image,  
        sentiment,
        sentimentConfidence: sentimentData.confidence, 
        priority,
        status: "pending", 
      });
  
      await newIssue.save(); 
      res.render("message", {
        issues: [newIssue], 
        sentiment,
        priority
      });
    }} catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong! Please try again.');
    }
  });
  

messageRouter.post("/status/:id",async(req,res)=>{
    const {id}=req.params;
    const {status}=req.body
    await message.findByIdAndUpdate(id,{status})
    return res.redirect("/message/")
})

messageRouter.post("/delete/:id",async(req,res)=>{
    await message.findByIdAndDelete(req.params.id)
    return res.redirect("/message/show")
})

// restrict("admin"),

module.exports=messageRouter
