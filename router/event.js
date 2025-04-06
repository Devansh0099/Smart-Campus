const {Router}=require("express")
const eventRouter=Router()
const multer=require('multer')
const path=require("path")
const event=require("../model/event")
// const multer=require('multer')
const user = require("../model/user")
const bookingEvent = require("../model/bookEvent")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve("./public/event"))
    },
    filename:function(req,file,cb){
        const filename=`${Date.now()}-${file.originalname}`
        cb(null,filename)
    }
})
const upload = multer({ storage });

eventRouter.get("/", async (req, res) => {
    try {
        const events = await event.find({});

        const updatedEvents = events.map(event => {
            return {
                ...event._doc,
                remainingSeat: event.totalSeat - event.count
            };
        });

        res.render("event", {
            events: updatedEvents,
            user: req.user
        });
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).send("Server error");
    }
});

eventRouter.get("/booked",async(req,res)=>{
    const u=await user.findById(req.user.id);
    const id=req.user.id
    const bookings=await bookingEvent.find({user:id}).populate("user").populate("event")
    // console.log(bookedEvents)
    res.render("bookevent",{user:req.user,bookings})
})

eventRouter.get("/:id",async(req,res)=>{
    const events=await event.findById(req.params.id)
    res.render("eventbrief",{events,user:req.user})
})

eventRouter.post("/create",upload.single("image"),async(req,res)=>{
    console.log(req.body)
    const {eventName,location,description,price,totalSeat,date}=req.body;
    const image=`/event/${req.file.filename}`
    const user=req.user.id;
    event.create({
        eventName,location,description,price,totalSeat,user,date,image
    })
    return res.redirect("/event")
})

eventRouter.post("/booking/:id",async(req,res)=>{
    const eve=await event.findById(req.params.id);
    const u=await user.findById(req.user.id);
    const {date}=req.body
    const book=await bookingEvent.create({
        user:req.user.id,
        event:req.params.id,
        date
    })
    book.save()
    eve.count++;
    eve.save()
    return res.redirect("/event")
})



module.exports=eventRouter
