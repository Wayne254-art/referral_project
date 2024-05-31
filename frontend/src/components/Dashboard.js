import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AsideNavbar from './UI/AsideNavBar';
import '../components/Styles/aside-navbar.css';
import { serverApi } from '../config/serverAPI';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${serverApi}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add Bearer before the token
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
                navigate('/login');
            }
        };

        fetchUserDetails();
    }, [navigate]);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="dashboard-container">
            <AsideNavbar user={user} />
            <div className="dashboard-content">
                <h1>Welcome To our Community!</h1>
                <p style={{ fontWeight: 'bold' }}>Hi 👋{user.username}, You are One step away to win!</p>
                <div className="referral-info">
                    <h3>Start earning now.</h3>
                    <h3>Refer a friend or family member.</h3>
                    <h3>Earn rewards on every approved referral.</h3>
                    <h2>MORE FRIENDS CAN LEAD TO MORE REWARDS FOR YOU.</h2>
                    <p>For approved referrals, you will earn:</p>
                    <div className="reward-tier">
                        <p>REFER</p>
                        <h3>1</h3>
                        <p>FRIEND</p>
                        <p>EARN</p>
                        <h3>50</h3>
                        <p>REWARD</p>
                    </div>
                    <div className="reward-tier">
                        <p>REFER</p>
                        <h3>3</h3>
                        <p>FRIENDS</p>
                        <p>EARN</p>
                        <h3>170</h3>
                        <p>REWARD</p>
                    </div>
                    <div className="reward-tier">
                        <p>REFER</p>
                        <h3>5</h3>
                        <p>FRIENDS</p>
                        <p>EARN</p>
                        <h3>300</h3>
                        <p>REWARD</p>
                    </div>
                    <div className="reward-tier">
                        <p>REFER</p>
                        <h3>10</h3>
                        <p>FRIENDS</p>
                        <p>EARN</p>
                        <h3>700</h3>
                        <p>REWARD</p>
                    </div>
                    <h3>NB//: Your first deposit gives you your 20% back</h3>
                    <p>PAYMENT IS MADE EVERYDAY AT 0000hrs DEPENDING WITH THE NUMBER OF REFERS YOU'VE MADE</p>
                </div>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Developed by @Wayne_Marwa</p>
            </div>
        </div>
    );
};

export default Dashboard;
