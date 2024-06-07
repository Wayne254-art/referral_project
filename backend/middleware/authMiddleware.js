
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config');

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });
};

exports.authorizeAdmin = (req, res, next) => {
    const userId = req.user.id;
    const query = 'SELECT isAdmin FROM users WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).send(err);
        if (!results[0]?.isAdmin) return res.status(403).send('Access forbidden');
        next();
    });
};
