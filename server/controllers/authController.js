const User = require('../models/User');
const jwt = require('jsonwebtoken');

// console.log('SECRET_KEY:', process.env.SECRET_KEY);

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        process.env.SECRET_KEY,
        {
            expiresIn: '7d'

        },
    );
};

const getTime = () => new Date().toLocaleString();

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already Registered' });

        const user = await User.create({ name, email, password });
        const token = generateToken(user);

        console.log(`User registered: ${email} at ${getTime()}`);

        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        console.error('[REGISTER ERROR]', error.message);
        console.error('[REGISTER ERROR STACK]', error.stack);

        // Send back a more detailed error message for debugging, but don't expose the full stack in production
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid Credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid Credentials' });

        const token = generateToken(user);

        console.log(`User logged in: ${email} at ${getTime()}`);

        res.json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

