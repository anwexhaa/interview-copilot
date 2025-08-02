const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { uid, email } = req.body;

  // ✅ Log incoming request
  console.log('📩 Received POST /api/users with:', { uid, email });

  if (!uid || !email) {
    console.warn('⚠️ Missing uid or email in request body');
    return res.status(400).json({ error: 'Missing uid or email' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { uid },
    });

    if (existingUser) {
      console.log('ℹ️ User already exists:', existingUser);
    } else {
      const newUser = await prisma.user.create({
        data: {
          uid,
          email,
        },
      });
      console.log('✅ New user created:', newUser);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Error while creating user:', err);
    res.status(500).json({ error: 'Failed to create user in DB' });
  }
});

module.exports = router;
