const express = require("express");
const router = express.Router();
const { createChat, getChats } = require("../controllers/chatController");
const { getGeminiResponse } = require("../utils/gemini");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Save user + AI messages manually (if using old method)
router.post("/", verifyFirebaseToken, createChat);

// Route to generate AI reply using Gemini & save it
router.post("/ask", verifyFirebaseToken, async (req, res) => {
  const { prompt } = req.body;

  if (typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const aiMessage = await getGeminiResponse(prompt);

    // ✅ Save to Prisma directly
    const savedChat = await prisma.chatMessage.create({
      data: {
        userId: req.user.id,
        userMessage: prompt,
        aiMessage: aiMessage,
        role: 'ai', // or 'user' if you're splitting roles
        type: 'chat', // optional
      },
    });

    res.status(200).json({ aiMessage });
  } catch (error) {
    console.error("❌ Error in /chat/ask:", error);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});


module.exports = router;
