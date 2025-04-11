const express = require("express");
const axios = require("axios");
const routers = express.Router();

// Your actual API key from api.market
const API_KEY = "cm9a3y25p0002l4043dgn11tg";

routers.post("/get-nutrition", async (req, res) => {
  const { ingredients, servings } = req.body;

  try {
    const response = await axios.get("https://prod.api.market/api/v1/apileague/compute-nutrition/compute-nutrition", {
      params: {
        ingredients,           // Example: "1 cup apples, 3oz milk, 35g butter"
        servings: servings || 1,
        "reduce-oils": true
      },
      headers: {
        "accept": "application/json",
        "x-magicapi-key": API_KEY
      }
    });

    const nutritionData = response.data;
    res.render("nutrition", { nutritionData, ingredients });

  } catch (err) {
    console.error("Error fetching nutrition data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch nutrition data");
  }
});

module.exports = routers;
