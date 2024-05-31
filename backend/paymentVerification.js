const express = require('express');
const db = require('./config');
const { authenticateToken } = require('./authenticateToken');
const router = express.Router();

// Route to update payment status
router.post('/payment-status', authenticateToken, (req, res) => {
    const { userId, isPaymentComplete, amount } = req.body;
    if (!userId || isPaymentComplete === undefined || !amount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Query to update payment status and amount
    db.query(
        'UPDATE payments SET isPaymentComplete = ?, amount = ? WHERE userId = ?',
        [isPaymentComplete, amount, userId],
        (err, results) => {
            if (err) {
                console.error('Error updating payment status:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            res.json({ message: 'Payment status updated successfully' });
        }
    );
});

// Route to verify if payment has reflected in the database
router.get('/verify-payment-reflection', authenticateToken, (req, res) => {
    const userId = req.user.userId; // Assuming userId is stored in the token

    // Query to check if the payment for the specific amount has been recorded in the database
    db.query('SELECT isPaymentComplete FROM payments WHERE userId = ? AND amount = 500', [userId], (err, results) => {
        if (err) {
            console.error('Error verifying payment reflection:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Payment not reflected in database' });
        }

        const { isPaymentComplete } = results[0];
        res.json({ success: isPaymentComplete });
    });
});

module.exports = router;