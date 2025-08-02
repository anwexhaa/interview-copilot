const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load Gemini API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/system-chat
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (err) {
    console.error("System Chat Error:", err.message);
    res.status(500).json({ error: "Something went wrong with Gemini." });
  }
});

module.exports = router;
