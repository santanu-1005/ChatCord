const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        req.userId = decoded.id;
        next();
    }catch(error){
        return res.status(400).json({ message: 'Invalid token, authorization denied.' });
    }
};

module.exports = authenticate;