const express = require("express");
const axios = require("axios");
const router = express.Router();

const apiKey = "your-openrouter-api-key"; 


const predefinedAnswers = {
  "where is the library": "The library is on the 2nd floor of the Main Building, next to the Auditorium.",
  "how to submit assignment": "Go to the 'Assignments' page, click an assignment, and upload your PDF.",
  "how can i see my uploaded assignments": "Check the 'Assignments' page. Your uploads appear under each assignment.",
  "how to report an issue": "Go to the 'Report Issue' section and fill out the form.",
  "where is the lost and found section": "Check the 'Lost & Found' from the navbar or visit /lf.",
  "i lost my id card what should i do": "Go to the 'Lost & Found' page and submit a lost item report.",
  "how to report a found item": "Go to 'Lost & Found' and submit the item as found.",
  "how to order from smart canteen": "Visit the 'Smart Canteen' page, view menu, and order directly.",
  "what is today’s canteen menu": "Check the 'Smart Canteen' page for the daily menu.",
  "are there any events this week": "Go to the 'Events' page to see upcoming events.",
  "how do i register for an event": "Click on the event and fill the registration form.",
  "how do i login": "Click 'Login' on navbar and enter credentials.",
  "how do i sign up": "Click 'Register' and fill in your details.",
  "how to view my profile": "Once logged in, click your name on navbar.",
  "how to logout": "Click 'Logout' from navbar.",
  "tell me a fun fact": "Did you know? Bananas are berries but strawberries aren’t!",
  "give me a motivational quote": "“Success is not final, failure is not fatal: It is the courage to continue that counts.”",
  "what is the campus wifi password": "The campus WiFi password is: DCE@1234",
  "where can i find lost items": "Check Lost & Found or visit admin office.",
  "when is the next event": "Go to the 'Events' page for the schedule.",
  "where is the canteen": "Behind the library, near Block C.",
  "hi": "Hello! How can I help you today?",
  "hello": "Hi there! Need any assistance?",
};


router.get("/chatbot", (req, res) => {
  res.render("chatbot",{user: req.user});
});


router.post("/", async (req, res) => {
  const userMessage = req.body.message.trim().toLowerCase();


  if (predefinedAnswers[userMessage]) {
    return res.json({ reply: predefinedAnswers[userMessage] });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: req.body.message }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8000", 
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenRouter API error:", err.message);
    res.status(500).json({ reply: "Sorry, I can't respond right now." });
  }
});

module.exports = router;
