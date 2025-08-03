const express = require('express');
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');
const { PrismaClient } = require('@prisma/client');


const prisma = require('../lib/prisma');
const router = express.Router();

router.post('/signup', verifyFirebaseToken, async (req, res) => {
  console.log('🟢 /auth/signup route hit');

  const { email, name, id } = req.user;

  try {
    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      console.log('⚠️ User already exists:', user.email);
      return res.status(200).json({ message: 'User already exists', user });
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        email,
        name: name || '', // fallback to empty string if name is missing
        uid: id,  // assuming you've updated schema field to `firebaseUid`
      },
    });

    console.log('✅ User created in DB:', user);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

module.exports = router;
