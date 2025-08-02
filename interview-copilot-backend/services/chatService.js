const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Save chat to DB using ChatMessage model
const saveChat = async (userMessage, aiMessage, type, userId) => {
  try {
    await prisma.chatMessage.create({
      data: {
        userId: userId,
        userMessage: userMessage,
        aiMessage: aiMessage,
        type: type,
        role: 'user', // technically this field is for individual messages, but keep it to match schema
      },
    });
    console.log(`✅ ChatMessage saved for userId: ${userId}`);
  } catch (error) {
    console.error("❌ Error saving ChatMessage:", error);
    throw error;
  }
};

module.exports = { saveChat };
