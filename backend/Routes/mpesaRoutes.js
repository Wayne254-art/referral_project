
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config');
require('dotenv').config();

// Middleware to parse JSON bodies
router.use(express.json());

// Callback route for M-Pesa
router.post('/api/mpesa/callback', (req, res) => {
    const callbackData = req.body;

    // Log the callback data
    console.log('M-Pesa Callback:', callbackData);

    // Process the callback data as needed and respond to Safaricom
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

module.exports = router;
