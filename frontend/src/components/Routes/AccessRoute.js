// src/components/Routes/PaymentVerificationRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PaymentVerificationRoute = ({ children, requiredAmount }) => {
    const [isPaymentVerified, setIsPaymentVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyPaymentStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8081/api/payment/status', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { amount } = response.data;

                if (amount >= requiredAmount) {
                    setIsPaymentVerified(true);
                } else {
                    alert('Please complete the payment to access this page.');
                }
            } catch (error) {
                console.error('Error verifying payment status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyPaymentStatus();
    }, [requiredAmount]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isPaymentVerified) {
        return <Navigate to="/payment" />;
    }

    return children;
};

export default PaymentVerificationRoute;
