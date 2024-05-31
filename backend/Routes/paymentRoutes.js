const express = require('express');
const axios = require('axios');
const db = require('../config');
const { authenticateToken } = require('../authenticateToken');
require('dotenv').config();

const router = express.Router();

// M-Pesa configuration
const mpesaBaseUrl = 'https://sandbox.safaricom.co.ke';
const mpesaAuthUrl = `${mpesaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`;
const mpesaStkPushUrl = `${mpesaBaseUrl}/mpesa/stkpush/v1/processrequest`;

const mpesaCredentials = {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
};

const getMpesaToken = async () => {
    const { consumerKey, consumerSecret } = mpesaCredentials;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await axios.get(mpesaAuthUrl, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    return response.data.access_token;
};

// Function to format the phone number
const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('0')) {
        return `254${phoneNumber.slice(1)}`;
    }
    return phoneNumber;
};

router.post('/api/mpesa/pay', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const amount = 500;
    const fixedPhoneNumber = '0799703637';  // Fixed phone number to receive payment

    try {
        const token = await getMpesaToken();
        console.log('Mpesa token received:', token);
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
        const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');
        console.log('Generated timestamp:', timestamp, 'Generated password:', password);

        const user = await new Promise((resolve, reject) => {
            db.query('SELECT contact FROM users WHERE id = ?', [userId], (err, results) => {
                if (err) {
                    console.error('Error fetching user:', err);
                    reject(err);
                } else if (results.length === 0) {
                    reject(new Error('User not found'));
                } else {
                    resolve(results[0]);
                }
            });
        });
        console.log('User contact retrieved:', user.contact);

        const formattedUserPhoneNumber = formatPhoneNumber(user.contact);
        const formattedFixedPhoneNumber = formatPhoneNumber(fixedPhoneNumber);
        console.log('Formatted user phone number:', formattedUserPhoneNumber);
        console.log('Formatted fixed phone number:', formattedFixedPhoneNumber);

        const response = await axios.post(
            mpesaStkPushUrl,
            {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: formattedUserPhoneNumber,
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: formattedFixedPhoneNumber,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: 'Payment',
                TransactionDesc: 'Payment description',
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log('Mpesa response:', response.data);

        const status = response.data.ResponseCode === '0' ? 'Success' : 'Failed';

        db.query(
            'INSERT INTO payments (user_id, phone_number, amount, status) VALUES (?, ?, ?, ?)',
            [userId, user.contact, amount, status],
            (err) => {
                if (err) {
                    console.error('Error saving payment:', err);
                    res.status(500).json({ success: false });
                } else {
                    res.json({ success: true });
                }
            }
        );
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
