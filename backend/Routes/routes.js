const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const db = require("../config");
const { Mail, initDb } = require("./Mail");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { getFundTransferAmount, getTodaysEarnings } = require("../utils");
const { getReferralCountForUser } = require("../utils");
const { getTodaysReferralEarnings } = require("../utils");
const { authenticateToken } = require("../authenticateToken");
const {
  UniqueString,
  UniqueNumber,
  UniqueStringId,
  UniqueNumberId,
  UniqueOTP,
  UniqueCharOTP,
  HEXColor,
  uuid,
} = require("unique-string-generator");

const router = express.Router();

const secret = process.env.JWT_SECRET || "jE8rwgfYpi";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


const mysql = require('mysql2/promise');

router.post('/api/process-transaction', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { paymentAmount, withdrawalAmount } = req.body;

    // const connection = await pool.getConnection();

    try {
        await db.beginTransaction();

        // Update payments table
        const [paymentResult] = await db.execute(
            `UPDATE payments SET amount = amount - (amount * 0.20) WHERE user_id = ? AND status = 'completed'`,
            [userId]
        );

        if (paymentResult.affectedRows === 0) {
            throw new Error('Payment update failed or no completed payments found.');
        }

        // Update users table
        const [userResult] = await db.execute(
            `UPDATE users SET balance = balance + ? WHERE id = ?`,
            [paymentAmount * 0.20, userId]
        );

        if (userResult.affectedRows === 0) {
            throw new Error('User balance update failed.');
        }

        // Insert into withdrawals table
        const [withdrawalResult] = await db.execute(
            `INSERT INTO withdrawals (user_id, amount, status) VALUES (?, ?, 'completed')`,
            [userId, withdrawalAmount]
        );

        if (withdrawalResult.affectedRows === 0) {
            throw new Error('Withdrawal insertion failed.');
        }

        await db.commit();
        res.status(200).send('Transaction processed successfully.');
    } catch (error) {
        await db.rollback();
        res.status(500).send(`Transaction failed: ${error.message}`);
    }
});

// Route to fetch pending withdrawal amount for a user
router.get("/api/withdrawals/pending", authenticateToken, (req, res) => {
  const userId = req.user.user_id;
  // console.log(userId)

  const query =
    'SELECT SUM(amount) AS pendingAmount FROM withdrawals WHERE userId = ? AND status = "pending"';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching pending withdrawal amount:", err);
      return res.status(500).json({ message: "Server error" });
    }

    const pendingAmount = results[0].pendingAmount || 0;
    res.status(200).json({ pendingAmount });
  });
});

// Route to fetch the number of referrals within the last 24 hours
router.get("/api/referrals/earnings", authenticateToken, (req, res) => {
  const userId = req.user.user_id;

  const query = `
        SELECT COUNT(*) AS referralCount
        FROM referrals
        WHERE referrer_id = ? AND TIMESTAMPDIFF(HOUR, dateReferred, NOW()) <= 24
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching referral earnings:", err.message);
      return res.status(500).json({ message: "Server error" });
    }

    const referralCount = results[0].referralCount || 0;
    const referralEarnings = referralCount * 50; // Assuming each referral earns 50 units

    res.status(200).json({ referralEarnings });
  });
});

// Route to get the user balance based on referrals
router.get("/api/user/balance", authenticateToken, (req, res) => {
  const userId = req.user.user_id;

  const query =
    "SELECT COUNT(*) as referralCount FROM referrals WHERE referrer_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching referrals:", err);
      return res.status(500).json({ message: "Server error" });
    }

    const referralCount = results[0].referralCount;
    // const balance = referralCount * 50;

    res.json({ referralCount });
  });
});

// Fetch active referrals
router.get("/api/active-referrals/:id", (req, res) => {
  const userId = req.params.id; // Assuming user ID is available in req.user

  // console.log("active-referalas",userId)

  const query = `
      SELECT 
          u.id AS referrer_id,
          u.username AS referrer_username,
          r.referralCode,
          r.referralLink,
          r.status
      FROM 
          referrals r
      JOIN 
          users u ON r.referrer_id = u.id
      WHERE 
          r.referrer_id = ?
          AND r.status = 'active';
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Count all referrals
router.get("/api/total-referrals-count/:id", (req, res) => {
  const userId = req.params.id;

  const query = `
      SELECT 
          COUNT(*) AS totalReferalCount
      FROM 
          referrals r
      WHERE 
          r.referrer_id = ?;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Count active referrals
router.get("/api/active-referrals-count/:id", (req, res) => {
  const userId = req.params.id; // Assuming user ID is available in req.user

  const query = `
      SELECT 
          COUNT(*) AS activeReferralsCount
      FROM 
          referrals r
      WHERE 
          r.referrer_id = ?
          AND r.status = 'active';
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Route to get the total amount withdrawn by the user
router.get("/api/user/total-withdrawn", authenticateToken, (req, res) => {
  const userId = req.user.user_id;

  const query =
    "SELECT SUM(amount) as totalWithdrawn FROM withdrawals WHERE userId = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching total withdrawn amount:", err);
      return res.status(500).json({ message: "Server error" });
    }

    const totalWithdrawn = results[0].totalWithdrawn || 0;

    res.json({ totalWithdrawn });
  });
});

// get the number of referrals
router.get("/api/referrals/count", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const referralCount = await getReferralCountForUser(userId);
    res.json({ referralCount });
  } catch (error) {
    console.error("Error fetching referral count:", error);
    res.status(500).json({ message: "Error fetching referral count" });
  }
});
router.get("/api/earnings/today", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const todaysEarnings = await getTodaysEarnings(userId);

    // console.log(todaysEarnings)
    res.json({ todaysEarnings });
  } catch (error) {
    console.error("Error fetching referral count:", error);
    res.status(500).json({ message: "Error fetching referral count" });
  }
});

//Funds transfer
router.get("/api/transfers/amount", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id; // assuming the user ID is stored in user_id
    const fundTransferAmount = await getFundTransferAmount(userId);
    res.json({ fundTransferAmount });
  } catch (error) {
    console.error("Error fetching fund transfer amount:", error);
    res.status(500).json({ message: "Error fetching fund transfer amount" });
  }
});

//Today's Earnings
router.get(
  "/api/earnings/referrals/today",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id; // assuming the user id is stored in req.user

      // console.log(userId);
      const todaysReferralEarnings = await getTodaysReferralEarnings(userId);
      res.json({ todaysReferralEarnings });
    } catch (error) {
      console.error("Error fetching today's referral earnings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to fetch total deposits for a user
router.get("/api/deposits/total", authenticateToken, (req, res) => {
  const userId = req.user.user_id;

  const query =
    "SELECT SUM(amount) AS totalDeposits FROM payments WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching total deposits:", err.message);
      return res.status(500).json({ message: "Server error" });
    }

    const totalDeposits = results[0].totalDeposits || 0;
    res.status(200).json({ totalDeposits });
  });
});

// Route to get user information
router.get("/api/user", authenticateToken, (req, res) => {
  const userId = req.user.user_id;

  db.query(
    "SELECT id, first_name,role, last_name, username, email, contact, image FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(results[0]);
    }
  );
});

router.post(`/api/withdraw`, authenticateToken, (req, res) => {
  res.json("workong");
});

// Initialize the database
initDb();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "waynemarwa5@gmail.com", // Replace with your email
    pass: "Wayne@21.", // Replace with your email password or app-specific password
  },
});

router.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const newMail = await Mail.create({ name, email, message });

    const mailOptions = {
      from: "waynemarwa5@gmail.com", // Replace with your email
      to: "everfront6@gmail.com",
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to send email." });
      }
      console.log("Email sent:", info.response);
    });

    res.json({
      success: true,
      message: "Message received successfully.",
      data: newMail,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
});

// Route to upload profile image
router.post(
  "/api/upload-profile-image",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    const userId = req.user.user_id;
    const imagePath = `/uploads/${req.file.filename}`;

    db.query(
      "UPDATE users SET image = ? WHERE id = ?",
      [imagePath, userId],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
        }
        res.json({ imagePath });
      }
    );
  }
);

router.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Route to sign up a new user
router.post("/api/signup", (req, res) => {
  const { first_name, last_name, username, email, contact, password } =
    req.body;

  const referralCode = UniqueCharOTP(6) + "-" + UniqueOTP(6);
  const role = 'user'

  // console.log(referralCode);

  db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
          first_name,
          last_name,
          username,
          email,
          contact,
          password: hashedPassword,
          role,
          referralCode,
        };
        db.query("INSERT INTO users SET ?", newUser, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
          }
          res.status(201).json({ message: "User created successfully" });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
});

// Route to log in a user
router.post("/api/login", (req, res) => {
  const { identifier, password } = req.body;
  const query =
    "SELECT * FROM users WHERE username = ? OR email = ? OR contact = ?";

  db.query(query, [identifier, identifier, identifier], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { user_id: user.id, username: user.username },
        secret
      );

      res.json({ token });
    });
  });
});

// // Mpesa payment processing
// const mpesaBaseUrl = 'https://sandbox.safaricom.co.ke';
// const mpesaAuthUrl = `${mpesaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`;
// const mpesaStkPushUrl = `${mpesaBaseUrl}/mpesa/stkpush/v1/processrequest`;

// const mpesaCredentials = {
//     consumerKey: process.env.MPESA_CONSUMER_KEY,
//     consumerSecret: process.env.MPESA_CONSUMER_SECRET,
// };

// const getMpesaToken = async () => {
//     const { consumerKey, consumerSecret } = mpesaCredentials;
//     const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
//     try {
//         const response = await axios.get(mpesaAuthUrl, {
//             headers: {
//                 Authorization: `Basic ${auth}`,
//             },
//         });
//         return response.data.access_token;
//     } catch (error) {
//         console.error('Error getting Mpesa token:', error.response ? error.response.data : error.message);
//         throw new Error('Failed to get Mpesa token');
//     }
// };

// router.use(express.json());

// router.post('/api/mpesa/callback', (req, res) => {
//     const callbackData = req.body;

//     // Process the callback data
//     console.log('M-Pesa Callback:', callbackData);

//     // Respond to Safaricom's M-Pesa API
//     res.json({ ResultCode: 0, ResultDesc: 'Success' });
// });

// router.post('/api/mpesa/pay', authenticateToken, async (req, res) => {
//     const userId = req.user.user_id;
//     const amount = 500;
//     const phoneNumber = '0799703637'; // Use the fixed phone number

//     try {
//         const token = await getMpesaToken();
//         const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
//         const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

//         const response = await axios.post(
//             mpesaStkPushUrl,
//             {
//                 BusinessShortCode: process.env.MPESA_SHORTCODE,
//                 Password: password,
//                 Timestamp: timestamp,
//                 TransactionType: 'CustomerPayBillOnline',
//                 Amount: amount,
//                 PartyA: phoneNumber,
//                 PartyB: process.env.MPESA_SHORTCODE,
//                 PhoneNumber: phoneNumber,
//                 CallBackURL: process.env.MPESA_CALLBACK_URL,
//                 AccountReference: 'Payment',
//                 TransactionDesc: 'Payment description',
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         const status = response.data.ResponseCode === '0' ? 'Success' : 'Failed';

//         db.query(
//             'INSERT INTO payments (user_id, phone_number, amount, status) VALUES (?, ?, ?, ?)',
//             [userId, phoneNumber, amount, status],
//             (err) => {
//                 if (err) {
//                     console.error('Error saving payment:', err);
//                     res.status(500).json({ success: false });
//                 } else {
//                     res.json({ success: true });
//                 }
//             }
//         );
//     } catch (error) {
//         console.error('Error processing payment:', error.response ? error.response.data : error.message);
//         res.status(500).json({ success: false });
//     }
// });

module.exports = router;
