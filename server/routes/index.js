const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoute');
const chatRoute = require('./chatRoute');

router.use('/api/auth', authRoutes);
router.use('/api/chat', chatRoute);

module.exports = router;