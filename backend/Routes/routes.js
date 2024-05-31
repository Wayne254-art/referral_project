const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const db = require('../config');
require('dotenv').config();

const router = express.Router();

const secret = process.env.JWT_SECRET || 'jE8rwgfYpi';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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

// Route to get user information
router.get('/user', authenticateToken, (req, res) => {
    const userId = req.user.user_id;

    db.query('SELECT id, first_name, last_name, username, email, contact, image FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);
    });
});

// Route to upload profile image
router.post('/upload-profile-image', authenticateToken, upload.single('image'), (req, res) => {
    const userId = req.user.user_id;
    const imagePath = `/uploads/${req.file.filename}`;

    db.query('UPDATE users SET image = ? WHERE id = ?', [imagePath, userId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json({ imagePath });
    });
});

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to sign up a new user
router.post('/signup', (req, res) => {
    const { first_name, last_name, username, email, contact, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { first_name, last_name, username, email, contact, password: hashedPassword };
            db.query('INSERT INTO users SET ?', newUser, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Server error' });
                }
                res.status(201).json({ message: 'User created successfully' });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// Route to log in a user
router.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? OR email = ? OR contact = ?';

    db.query(query, [identifier, identifier, identifier], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ user_id: user.id }, secret, { expiresIn: '1h' });
            res.json({ token, user });
        });
    });
});

// Mpesa payment processing
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
    try {
        const response = await axios.get(mpesaAuthUrl, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Mpesa token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get Mpesa token');
    }
};

router.use(express.json());

router.post('/api/mpesa/callback', (req, res) => {
    const callbackData = req.body;

    // Process the callback data
    console.log('M-Pesa Callback:', callbackData);

    // Respond to Safaricom's M-Pesa API
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

router.post('/api/mpesa/pay', authenticateToken, async (req, res) => {
    const userId = req.user.user_id;
    const amount = 500;
    const phoneNumber = '0799703637'; // Use the fixed phone number

    try {
        const token = await getMpesaToken();
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
        const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

        const response = await axios.post(
            mpesaStkPushUrl,
            {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: phoneNumber,
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

        const status = response.data.ResponseCode === '0' ? 'Success' : 'Failed';

        db.query(
            'INSERT INTO payments (user_id, phone_number, amount, status) VALUES (?, ?, ?, ?)',
            [userId, phoneNumber, amount, status],
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
        console.error('Error processing payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
