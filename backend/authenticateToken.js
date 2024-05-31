
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'jE8rwgfYpi';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token missing or malformed' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
