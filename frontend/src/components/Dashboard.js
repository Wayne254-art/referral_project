import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AsideNavbar from './UI/AsideNavBar';
import '../components/Styles/aside-navbar.css';
import Popup from './Popup';
import { serverApi } from '../config/serverAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // eslint-disable-next-line
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [isPopupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                
                const StatusResponse = await axios.get(`${serverApi}/payment/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (StatusResponse.data.status !== 'completed') {
                    navigate('/payment')

                }

                // Fetch user details
                const userResponse = await axios.get(`${serverApi}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userResponse.data);

                // Fetch total deposits
                const depositsResponse = await axios.get(`${serverApi}/deposits/total`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const total = depositsResponse.data.totalDeposits;
                setTotalDeposits(total);

                if (total <= 499) {
                    toast.error('Please make payments first');
                    navigate('/payment');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data.');
                navigate('/login');
            }
        };

        fetchData();
    }, [navigate]);

    // console.log(user)

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('hasSeenPopup');
        if (!hasSeenPopup) {
            setPopupVisible(true);
        }
    }, []);

    const handlePopupSubmit = (inputValue) => {
        console.log('User input:', inputValue);
        localStorage.setItem('hasSeenPopup', 'true');
        setPopupVisible(false);
    };

    const handlePopupClose = () => {
        localStorage.setItem('hasSeenPopup', 'true');
        setPopupVisible(false);
    };

    if (!user) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <AsideNavbar user={user} />
            <div className="dashboard-content">
                <h1>Welcome To our Community!</h1>
                <p style={{ fontWeight: 'bold' }}>Hi 👋{user.username}, You are one step away from winning!</p>
                <div className="referral-info">
                    <h2>Start earning now.</h2>
                    <h2>Refer a friend or family member.</h2>
                    <h2>Earn rewards on every approved referral.</h2>
                    <h4>MORE FRIENDS CAN LEAD TO MORE REWARDS FOR YOU.</h4>
                    <p>For approved referrals, you will earn:</p>
                    <div className="reward-tier">
                        <p>REFER</p>
                        <h2>1</h2>
                        <p>FRIEND</p>
                        <p>EARN</p>
                        <h2>50</h2>
                        <p>REWARD</p>
                    </div>
                    <div className="reward-tier">
                        <p>REFER</p>
                        <h2>3</h2>
                        <p>FRIENDS</p>
                        <p>EARN</p>
                        <h2>170</h2>
                        <p>REWARD</p>
                    </div>
                    <div className="reward-tier">
                        <p>REFER</p>
                        <h2>5</h2>
                        <p>FRIENDS</p>
                        <p>EARN</p>
                        <h2>300</h2>
                        <p>REWARD</p>
                    </div>
                    <div className="reward-tier">
                        <p>REFER</p>
                        <h2>10</h2>
                        <p>FRIENDS</p>
                        <p>EARN</p>
                        <h2>700</h2>
                        <p>REWARD</p>
                    </div>
                    <h2>NB: Your first deposit gives you 20% back</h2>
                    <p>Payment is made every day at 0000hrs depending on the number of referrals you've made.</p>
                </div>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Developed by @Wayne_Marwa</p>
            </div>
            <Popup
                isVisible={isPopupVisible}
                onClose={handlePopupClose}
                onSubmit={handlePopupSubmit}
            />
            <ToastContainer />
        </div>
    );
};

export default Dashboard;
