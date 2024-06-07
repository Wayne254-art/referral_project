// backend/controllers/adminController.js
const { authenticateToken, isAdmin } = require("../authenticateToken");
const db = require("../config");
const router = require("express").Router();

router.get("/users", authenticateToken, isAdmin(`Admin`), (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

router.get("/referrals", authenticateToken, isAdmin("Admin"), (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
router.get("/deposits", authenticateToken, isAdmin("Admin"), (req, res) => {
  const query = "SELECT SUM(amount) as totalDeposits FROM deposits";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});
router.get(
  "/withdrawals",
  authenticateToken,
  isAdmin("Admin"),

  (req, res) => {
    const query = "SELECT SUM(amount) as totalWithdrawals FROM withdrawals";
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results[0]);
    });
  }
);

router.get("/emails", authenticateToken, isAdmin("Admin"), (req, res) => {
  const query = "SELECT * FROM mails";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// exports.getAllUsers = (req, res) => {
//     const query = 'SELECT * FROM users';
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).send(err);
//         res.json(results);
//     });
// };

// exports.getAllReferrals = (req, res) => {
//     const query = 'SELECT * FROM referrals';
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).send(err);
//         res.json(results);
//     });
// };

// exports.getTotalDeposits = (req, res) => {
//     const query = 'SELECT SUM(amount) as totalDeposits FROM deposits';
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).send(err);
//         res.json(results[0]);
//     });
// };

// exports.getTotalWithdrawals = (req, res) => {
//     const query = 'SELECT SUM(amount) as totalWithdrawals FROM withdrawals';
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).send(err);
//         res.json(results[0]);
//     });
// };

module.exports = router;
