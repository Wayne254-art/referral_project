import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const verifyPaymentStatus = async (navigate, setIsPaymentVerified) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const response = await axios.get('https://2160-41-80-118-173.ngrok-free.app/api/payment-status', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.isPaymentComplete) {
            setIsPaymentVerified(true);
            return true;
        } else {
            toast.error('Please complete the payment to access this page.');
            navigate('/payment'); // Redirect to payment page if payment is not complete
            return false;
        }
    } catch (error) {
        console.error('Error verifying payment status:', error);
        toast.error('An error occurred. Please try again.');
        return false;
    }
};

const useVerifyPaymentStatus = (setIsPaymentVerified) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkPaymentStatus = async () => {
            const isVerified = await verifyPaymentStatus(navigate, setIsPaymentVerified);
            if (isVerified) {
                clearInterval(paymentInterval);
            }
        };

        const paymentInterval = setInterval(checkPaymentStatus, 5000);

        // Initial check
        checkPaymentStatus();

        // Cleanup interval on component unmount
        return () => clearInterval(paymentInterval);
    }, [navigate, setIsPaymentVerified]);
};

export default useVerifyPaymentStatus;
