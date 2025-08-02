const { getGeminiResponse } = require('../utils/gemini');
const { saveChat } = require('../services/chatService');

const createChat = async (req, res) => {
  try {
    let {
      userMessage,
      type = 'default',
      userId = 'demo-user',
      currentQuestion
    } = req.body;

    // Override userId with Firebase user if available
    if (req.user && req.user.id) {
      userId = req.user.id;
    }

    console.log("Received userMessage:", userMessage);

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const originalUserMessage = userMessage.trim(); // Save this to DB later

    // Handle AI Interview prompt injection
    if (type === 'ai-interview') {
      if (!currentQuestion || currentQuestion.trim() === "") {
        currentQuestion = 'The previous question was not provided.';
      }

      const preInterviewPrompt = `
You are an expert AI interviewer conducting a technical interview.

The current question you asked the candidate is:
"${currentQuestion}"

The candidate responded:
"${originalUserMessage}"

Please respond in EXACTLY the following format:

Feedback:
<Provide clear, constructive feedback on the candidate's answer, including strengths and areas for improvement. If the answer is insufficient or incorrect, state that politely.>

Model Answer:
<Provide a complete, detailed, and explicit ideal answer to the "${currentQuestion}" above. Do NOT hedge, qualify, or say you cannot provide an answer. ALWAYS provide a thorough model answer regardless of the candidate's response.>

Next Question:
<Ask the next relevant interview question related to system design, DSA, or behavioral skills.>

Do not include anything else outside this format.
      `.trim();

      userMessage = preInterviewPrompt;
    }

    // Get AI response
    const aiMessage = await getGeminiResponse(userMessage);

    // Save to DB using original user input
    await saveChat(originalUserMessage, aiMessage, type, userId);

    // Send AI response back to client
    return res.status(200).json({ aiMessage });
  } catch (error) {
    console.error("createChat Error:", error);
    return res.status(500).json({ error: "Gemini API failed" });
  }
};

module.exports = { createChat };
