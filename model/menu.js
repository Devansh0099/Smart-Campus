const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Snacks", "Beverages", "Meals", "Desserts", "Others"],
    default: "Others",
  },
  available: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String, // URL or file path
    default: "",
  },
});

const Menu = mongoose.model("Menu", menuItemSchema);
module.exports = Menu;
