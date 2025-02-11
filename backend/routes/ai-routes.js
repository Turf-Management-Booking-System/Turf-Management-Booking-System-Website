const express = require("express");
const router = express.Router();
// getting the open ai 
const { OpenAI } = require("openai");
require("dotenv").config();
// creating a new object of open ai 
const openai = new OpenAI({
  apiKey: process.env.OPEN_CHATGTP_SECRET_KEY,
});

router.post("/ask", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json(
        { success: false,
          message: "Query is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: query }],
    });

    res.status(200).json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "AI Assistant Error",
      error: error.message,
    });
  }
});

module.exports = router;
