

const express = require('express');
const db = require('../config');
const { authenticateToken } = require('../authenticateToken');

const router = express.Router();

// Fetch user data
router.get('/user', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.query('SELECT id, first_name, last_name, username, email, contact, image FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);
    });
});

module.exports = router;
