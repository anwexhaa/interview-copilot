// test.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/test-prisma', async (req, res) => {
  try {
    const progress = await prisma.dSAProgress.findMany(); // change this to match your model name
    res.json(progress);
  } catch (error) {
    console.error('Prisma test error:', error);
    res.status(500).json({ error: 'Prisma test failed' });
  }
});

module.exports = router;
