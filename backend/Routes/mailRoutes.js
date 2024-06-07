
// backend/routes/mailRoutes.js
const express = require('express');
const router = express.Router();
const { getAllEmails } = require('../controllers/mailController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const { isAdmin } = require('../authenticateToken');

router.get('/', authenticateToken, isAdmin('Admin'), getAllEmails);

module.exports = router;
