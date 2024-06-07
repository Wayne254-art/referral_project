// utils.js
const db = require('./config'); // Adjust the path to your db module as needed

/**
 * Get the referral count for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} The referral count for the user.
 */
async function getReferralCountForUser(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS referralCount FROM referrals WHERE referrer_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0].referralCount);
        });
    });
}

/**
 * Get the fund transfer amount for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} The fund transfer amount for the user.
 */
async function getFundTransferAmount(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT SUM(amount) AS fundTransferAmount FROM transfers WHERE userId = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0].fundTransferAmount || 0);
        });
    });
}

/**
 * Get today's referral earnings for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} Today's referral earnings for the user.
 */
async function getTodaysReferralEarnings(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(*) AS todaysReferrals
            FROM referrals
            WHERE referrer_id = ? AND DATE(created_at) = CURDATE()
        `;
        db.query(query, [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            const todaysReferrals = results[0].todaysReferrals;
            const todaysReferralEarnings = todaysReferrals * 50;
            resolve(todaysReferralEarnings);
        });
    });
}


/**
 * Get today's earnings for a specific user for the past 24 hours.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} Today's earnings for the user.
 */
async function getTodaysEarnings(userId) {
    const query = `
        SELECT SUM(amount) AS todays_earnings
        FROM transfers
        WHERE userId = ?
        AND created_at >= NOW() - INTERVAL 1 DAY;
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching today\'s earnings:', err);
                return reject(err);
            }
            const todaysEarnings = results[0] ? results[0].todays_earnings : 0;
            resolve(todaysEarnings || 0);
        });
    });
}

module.exports = {
    getReferralCountForUser,
    getFundTransferAmount,
    getTodaysReferralEarnings,
    getTodaysEarnings,
};


module.exports = {
    getReferralCountForUser,
    getFundTransferAmount,
    getTodaysReferralEarnings,
    getTodaysEarnings,
};
