const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Create one-to-one chat
router.post('/create-one-to-one', authMiddleware, chatController.createOneToOneChat);

// Create a group chat
router.post('/create-group', authMiddleware, chatController.createGroupChat);

// Send a message
router.post('/send-message', authMiddleware, chatController.sendMessage);

// Get all messages in a chat
router.get('/:chatId/messages', authMiddleware, chatController.getMessages);

module.exports = router;
