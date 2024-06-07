

const express = require('express');
const db = require('../config');
const { authenticateToken } = require('../authenticateToken');

const router = express.Router();

// Backend endpoint to check payment status and return contact and amount
router.get('/api/payment/status', authenticateToken, (req, res) => {
    const userId = req.user.user_id; // Corrected to extract userId from req.user

    // console.log(userId)

    db.query('SELECT amount, status, transaction_id, contact FROM payments WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error verifying payment status:', err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No payment record found for this user' });
        }

        const { amount, status, transaction_id, contact } = results[0];
        res.json({ success: true, amount, status, transaction_id, contact });
    });
});

module.exports = router;