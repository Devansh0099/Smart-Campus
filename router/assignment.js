const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const Assignment = require("../model/assignment");
const AssignmentUpload = require("../model/assignmentUpload");

const assignRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve("./public/assignment")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


assignRouter.get("/", async (req, res) => {
  const assignments = await Assignment.find({}).sort({ createdAt: -1 });
  const uploads = await AssignmentUpload.find({ submittedBy: req.user.id }).populate("assignment");
  res.render("assignment", { user: req.user, assignments, uploads });
});


assignRouter.post("/add", async (req, res) => {
  const { subject, title, email, deadline } = req.body;
  await Assignment.create({ subject, title, email, deadline, createdBy: req.user.id });
  res.redirect("/assignment");
});


assignRouter.get("/:id", async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  res.render("singleAssignment", { assignment, user: req.user });
});

assignRouter.post("/upload/:id", upload.single("pdf"), async (req, res) => {
  const { date } = req.body;
  const pdf = `/assignment/${req.file.filename}`;
  await AssignmentUpload.create({
    date,
    pdf,
    submittedBy: req.user.id,
    assignment: req.params.id
  });
  res.redirect("/assignment");
});

module.exports = assignRouter;
