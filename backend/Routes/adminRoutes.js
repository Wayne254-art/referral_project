
// // backend/routes/adminRoutes.js
// const express = require('express');
// const router = express.Router();
// const { getAllUsers, getAllReferrals, getTotalDeposits, getTotalWithdrawals } = require('../controllers/adminController');
// const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// router.get('/users', authenticateToken, isAdmin('Admin'), getAllUsers);
// router.get('/referrals', authenticateToken, isAdmin('Admin'), getAllReferrals);
// router.get('/deposits', authenticateToken, isAdmin('Admin'), getTotalDeposits);
// router.get('/withdrawals', authenticateToken, isAdmin('Admin'), getTotalWithdrawals);

// module.exports = router;
