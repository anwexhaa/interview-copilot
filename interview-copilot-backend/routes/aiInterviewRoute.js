const express = require('express');
const router = express.Router();
const { createChat } = require('../controllers/chatController');

router.post('/', (req, res, next) => {
  // Inject 'ai-interview' as the type
  req.body.type = 'ai-interview';
  return createChat(req, res, next);
});

module.exports = router;
