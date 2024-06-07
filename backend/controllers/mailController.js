
// backend/controllers/mailController.js
const db = require('../config');

exports.getAllEmails = (req, res) => {
    const query = 'SELECT * FROM mails';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};
