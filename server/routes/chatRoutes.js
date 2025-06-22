const express = require('express');
const router = express.Router();
const { getMessagesWithUser, sendMessageToUser, getInteractedUsers } = require('../controllers/chatController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/with/:userId', authenticate, getMessagesWithUser);
router.post('/to/:recipientId', authenticate, sendMessageToUser);
router.get('/interacted-user', authenticate, getInteractedUsers);

module.exports = router;
