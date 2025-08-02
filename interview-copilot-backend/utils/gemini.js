const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getGeminiResponse = async (userMessage) => {
  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Error from Gemini:", err);
    throw new Error("Failed to generate AI response");
  }
};

module.exports = { getGeminiResponse };
