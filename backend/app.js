const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser")
const router = require('./Routes/routes'); // Assuming routes.js is in the same directory

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.use('/uploads', express.static('uploads'));


const mpesaRoutes = require('./Routes/mpesaRoutes'); // Adjust the path as necessar
const authRoutes = require('./Routes/paymentRoutes');
const userRoutes = require('./Routes/userRoutes');
const paymentstatusRoute = require('./Routes/paymentstatusRoute');

app.use(authRoutes);
app.use(mpesaRoutes);
app.use(userRoutes);
app.use(paymentstatusRoute);

// Start the server
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
