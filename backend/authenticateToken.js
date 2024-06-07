
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'jE8rwgfYpi';

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // console.log(authHeader)
    // console.log(token)

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


// Admin auth
exports.isAdmin = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(500)
          .json({
            message: `Operation not permitted to ${req.user.role} ..Access denied`,
          });
      }
      next();
    };
  };


