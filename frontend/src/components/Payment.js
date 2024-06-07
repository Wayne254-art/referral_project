import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/payment.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { serverApi } from '../config/serverAPI';


const Payment = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount] = useState(500);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [user, setUser] = useState('')
    const [loading, setLoading] = useState(false)

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


                const StatusResponse = await axios.get(`${serverApi}/payment/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (StatusResponse.data.status === 'completed') {
                    navigate('/dashboard')

                }
                // console.log(status)

                // Fetch user details
                const userResponse = await axios.get(`${serverApi}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userResponse.data);

            } catch (error) {
                console.error('Error fetching user data:', error);
                // toast.error("Error fetching user data");
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
            const userId = user.id

            setLoading(true)

            // console.log(userId)

            const response = await axios.post(
                `${serverApi}/mpesa/pay`,
                { phoneNumber, amount, userId },
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
                }, 3 * 60 * 60 * 1000); // Adjust the timeout as needed

                setLoading(true)
            } else {
                setPaymentStatus('Payment failed. Please try again.');
                toast.error('Payment failed. Please try again.');
            }

            setLoading(false)
        } catch (error) {
            console.error('Error processing payment:', error);
            setPaymentStatus('Error processing payment. Please try again.');
            toast.error('Error processing payment. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="cover g-bg-img-hero cover g-flex-centered g-pos-rel g-py-100" id="cover-picture-GRC004-0" style={{ height: '100vh' }}>
            <div className="payment-container">
                <h4>Make a Payment</h4>
                <form onSubmit={handlePayment}>
                    <label htmlFor="phoneNumber" />
                    <input
                        type="text"
                        id="phoneNumber"
                        placeholder='contact'
                        value={phoneNumber}
                        readOnly
                    />
                    <label htmlFor="amount" />
                    <input
                        type="number"
                        id="amount"
                        placeholder='amount'
                        value={amount}
                        readOnly
                    />
                    <button type="submit"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </form>
                {/* {paymentStatus && <p className="payment-status">{paymentStatus}</p>} */}
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Made Payment? <a href="/proceedform" className="signup-link">Continue</a></p>
                <ToastContainer />
            </div>
            <div className='button-container'>
                <button className="button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Payment;
