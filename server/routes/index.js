const express = require('express');
const authRoutes = require('./authRoute');
const chatRoutes = require('./chatRoutes');
const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/chats', chatRoutes);

module.exports = router;