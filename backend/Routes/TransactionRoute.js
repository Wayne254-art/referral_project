
const mysql = require('mysql2/promise');

// Database connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Refferal_Program'
});

router.post('/api/process-transaction', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { paymentAmount, withdrawalAmount } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Update payments table
        const [paymentResult] = await connection.execute(
            `UPDATE payments SET amount = amount - (amount * 0.20) WHERE user_id = ? AND status = 'completed'`,
            [userId]
        );

        if (paymentResult.affectedRows === 0) {
            throw new Error('Payment update failed or no completed payments found.');
        }

        // Update users table
        const [userResult] = await connection.execute(
            `UPDATE users SET balance = balance + ? WHERE id = ?`,
            [paymentAmount * 0.20, userId]
        );

        if (userResult.affectedRows === 0) {
            throw new Error('User balance update failed.');
        }

        // Insert into withdrawals table
        const [withdrawalResult] = await connection.execute(
            `INSERT INTO withdrawals (user_id, amount, status) VALUES (?, ?, 'completed')`,
            [userId, withdrawalAmount]
        );

        if (withdrawalResult.affectedRows === 0) {
            throw new Error('Withdrawal insertion failed.');
        }

        await connection.commit();
        res.status(200).send('Transaction processed successfully.');
    } catch (error) {
        await connection.rollback();
        res.status(500).send(`Transaction failed: ${error.message}`);
    } finally {
        connection.release();
    }
});

module.exports = router;
