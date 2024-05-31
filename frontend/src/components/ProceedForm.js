import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { serverApi } from '../config/serverAPI';

const ProceedForm = () => {
    const [contact, setContact] = useState('');
    const [amount, setAmount] = useState(0);
    const [status, setStatus] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('No token found, redirecting to login.');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${serverApi}/payment/status`,{withCredentials: true}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setContact(response.data.contact);
                    setAmount(response.data.amount);
                    setStatus(response.data.status);
                    setTransactionId(response.data.transaction_id);
                } else {
                    toast.error('No record found.');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment details:', error);
                toast.error(error.response.data.message);
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [navigate]);

    const handleSubmit = () => {
        if (contact && amount > 0 && status && transactionId) {
            navigate('/dashboard');
        } else {
            toast.error('No record found. Please complete the payment process first.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="proceed-form-container">
            <h2>Proceed with Payment</h2>
            <form>
                <label htmlFor="contact">Contact:</label>
                <input
                    type="text"
                    id="contact"
                    value={contact}
                    readOnly
                />
                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    readOnly
                />
                <label htmlFor="status">Status:</label>
                <input
                    type="text"
                    id="status"
                    value={status}
                    readOnly
                />
                <label htmlFor="transactionId">Transaction ID:</label>
                <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    readOnly
                />
                <button type="button" onClick={handleSubmit}>Continue</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ProceedForm;
