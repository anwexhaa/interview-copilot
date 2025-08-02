const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

const geminiRoute = require('./routes/gemini');
const chatRoutes = require('./routes/chatRoutes');
const resumeReviewRoute = require('./routes/resumeReview');
const resumeReview = require('./routes/resumeReview');
const testRouter = require('./routes/test');
const systemChatRoute = require('./routes/systemChat');
const aiInterviewRoute = require('./routes/aiInterviewRoute');
const verifyFirebaseToken = require('./middlewares/verifyFirebaseToken');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/users');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// ✅ Allow both local and deployed frontend URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://interview-copilot-bice.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Mount routes
app.use('/api/chat', chatRoutes);
app.use('/api/gemini', geminiRoute);
app.use('/api/resume-review', resumeReviewRoute);
app.use('/api/resume-review', resumeReview);
app.use('/api', testRouter);
app.use('/api/system-chat', systemChatRoute);
app.use('/api/ai-interview', aiInterviewRoute);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Interview Copilot backend is running!');
});

// ✅ Example Prisma route
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
});
