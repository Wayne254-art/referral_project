import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/payment.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsideNavbar from './UI/AsideNavBar';
import { useNavigate } from 'react-router-dom';
import { serverApi } from '../config/serverAPI';

const Payment = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount] = useState(500);
    const [paymentStatus, setPaymentStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found, redirecting to login.');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${serverApi}/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const user = response.data;
                if (user.contact) {
                    setPhoneNumber(user.contact);
                } else {
                    toast.error('Phone number not found in user data.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error(error.response.data.message);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to login.');
                navigate('/login');
                return;
            }

            const response = await axios.post(
                'https://2160-41-80-118-173.ngrok-free.app/api/mpesa/pay',
                { phoneNumber, amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Wait a few seconds and verify if the payment is reflected in the database
                setTimeout(async () => {
                    try {
                        const verificationResponse = await axios.get(`${serverApi}/payment/status`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (verificationResponse.data.amount === amount) {
                            setPaymentStatus('Payment successful!');
                            toast.success('Payment successful!');
                            navigate('/dashboard'); // Redirect to the dashboard if payment is successful
                        } else {
                            setPaymentStatus('Payment not reflected in the database. Please try again.');
                            toast.error('Payment not reflected in the database. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error verifying payment reflection:', error);
                        setPaymentStatus('Error verifying payment. Please try again.');
                        toast.error('Error verifying payment. Please try again.');
                    }
                }, 5000); // Adjust the timeout as needed
            } else {
                setPaymentStatus('Payment failed. Please try again.');
                toast.error('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setPaymentStatus('Error processing payment. Please try again.');
            toast.error('Error processing payment. Please try again.');
        }
    };

    return (
        <>
            <AsideNavbar />
            <div className="payment-container">
                <h2>Make a Payment</h2>
                <form onSubmit={handlePayment}>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        value={phoneNumber}
                        readOnly
                    />
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        readOnly
                    />
                    <button type="submit">Pay Now</button>
                </form>
                {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
                <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Made Payment? <a href="/proceedform" className="signup-link">Continue</a></p>
                <ToastContainer />
            </div>
        </>
    );
};

export default Payment;
