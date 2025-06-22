const express = require('express');
const router = express.Router();
const {login, register, getUserInfo, updateProfile} = require("../controllers/authController");
const authenticate = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer')

router.post('/login', login);
router.post('/register', register);
router.get('/user-info', authenticate, getUserInfo);
router.post('/update-profile', authenticate, upload.single('file'), updateProfile);

module.exports = router;

// 68441bae4659ecc1821ef664--akash

// 68441b3b4659ecc1821ef661--santa