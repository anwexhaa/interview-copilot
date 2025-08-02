const express = require("express");
const router = express.Router();
const { createChat, getChats } = require("../controllers/chatController");
const { getGeminiResponse } = require("../utils/gemini");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

// Save user + AI messages manually (if using old method)
router.post("/", verifyFirebaseToken, createChat);

// Route to generate AI reply using Gemini & save it
router.post("/chat/ask", verifyFirebaseToken, async (req, res) => {
  const { prompt } = req.body;

  if (typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const aiMessage = await getGeminiResponse(prompt);

    // Reuse controller to save chat
    const savedChat = await createChat(
      {
        body: {
          userMessage: prompt,
          aiMessage,
          userId: req.user.id, // ← passed from middleware
        },
      },
      {
        status: () => ({
          json: (data) => data,
        }),
      }
    );

    res.status(200).json(savedChat);
  } catch (error) {
    console.error("❌ Error in /chat/ask:", error);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

module.exports = router;
