const { Router } = require("express");
const eventRouter = Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");  // Import form-data
const event = require("../model/event");
const user = require("../model/user");
const bookingEvent = require("../model/bookEvent");
const extractEventDetails = require("../utils/extractEventDetails");
const fetch = require("node-fetch");  // Import fetch for server-side use

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/event"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

eventRouter.get("/", async (req, res) => {
  try {
    const events = await event.find({});
    const updatedEvents = events.map(event => ({
      ...event._doc,
      remainingSeat: event.totalSeat - event.count
    }));
    res.render("event", {
      events: updatedEvents,
      user: req.user
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Server error");
  }
});

// GET Booked Events
eventRouter.get("/booked", async (req, res) => {
  const u = await user.findById(req.user.id);
  const id = req.user.id;
  const bookings = await bookingEvent.find({ user: id }).populate("user").populate("event");
  res.render("bookevent", { user: req.user, bookings });
});

// GET Single Event Detail
eventRouter.get("/:id", async (req, res) => {
  const events = await event.findById(req.params.id);
  res.render("eventbrief", { events, user: req.user });
});

// CREATE EVENT (final submit)
eventRouter.post("/create", upload.single("image"), async (req, res) => {
  const { eventName, location, description, price, totalSeat, date } = req.body;
  const image = `/event/${req.file.filename}`;
  const userId = req.user.id;
  await event.create({
    eventName, location, description, price, totalSeat, user: userId, date, image
  });
  return res.redirect("/event");
});

// BOOK EVENT
eventRouter.post("/booking/:id", async (req, res) => {
  const eve = await event.findById(req.params.id);
  const { date } = req.body;

  await bookingEvent.create({
    user: req.user.id,
    event: req.params.id,
    date
  });

  eve.count++;
  await eve.save();
  return res.redirect("/event");
});

module.exports = eventRouter;
