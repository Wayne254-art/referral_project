import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles/proceed-form.css'
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

                const response = await axios.get(`${serverApi}/payment/status`, {
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

    // console.log(status)
    
    const handleSubmit = () => {
        if (contact && amount > 0 && status && transactionId) {
            navigate('/dashboard');
        } else {
            toast.error('No record found. Please complete the payment process first.');
        }
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="cover g-bg-img-hero cover g-flex-centered g-pos-rel g-py-100" id="cover-picture-GRC004-0" style={{height: '100vh'}}>
        <div className="proceed-form-container">
            <form>
                <h4 style={{ display: 'flex', justifyContent: 'center' }}>Confirm Your Payment Status to Continue</h4>
                <label htmlFor="contact"/>
                <input
                    type="text"
                    id="contact"
                    placeholder='contact'
                    value={contact}
                    readOnly
                />
                <label htmlFor="amount"/>
                <input
                    type="number"
                    id="amount"
                    placeholder='amount'
                    value={amount}
                    readOnly
                />
                <label htmlFor="status"/>
                <input
                    type="text"
                    id="status"
                    placeholder='status'
                    value={status}
                    readOnly
                />
                <label htmlFor="transactionId"/>
                <input
                    type="text"
                    id="transactionId"
                    placeholder='transaction_id'
                    value={transactionId}
                    readOnly
                />
                <button type="button" onClick={handleSubmit}>Continue</button>
                 <a href="/payment" className="signup-link">Make Payment</a>
            </form>
            <ToastContainer />
        </div>
        </div>
    );
};

export default ProceedForm;
