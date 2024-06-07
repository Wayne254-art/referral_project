
// config.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Refferal_Program'
});

db.connect((err) => {
    if (err){

        console.log('Error  not connected to database', err.message);
    }else{
        console.log('connecteed to db')
    }
});

module.exports = db;
