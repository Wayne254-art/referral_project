// src/components/Earn.js
import React from 'react';
import '../components/Styles/earn.css';
import AsideNavbar from './UI/AsideNavBar';

const Earn = () => {
    return (
        <>
        <AsideNavbar/>
        <div className="earn-page">
            <div className="earn-container">
                <div className="earn-item">
                    <p>Kes.9,568.00</p>
                    <span>Ultimate Balance</span>
                </div>
                <div className="earn-item">
                    <p>Kes.7,480.00</p>
                    <span>Total Payout</span>
                </div>
                <div className="earn-item">
                    <p>Kes.24k.00</p>
                    <span>Deposits Total</span>
                </div>
                <div className="earn-item">
                    <p>Kes.242.00</p>
                    <span>Pending Amount</span>
                </div>
                <div className="earn-item">
                    <p>Kes.465.00</p>
                    <span>Interest Earn</span>
                </div>
                <div className="earn-item">
                    <p>Kes.158.00</p>
                    <span>Total Earning</span>
                </div>
                <div className="earn-item">
                    <p>Kes.814.00</p>
                    <span>Referral Earnings</span>
                </div>
                <div className="earn-item">
                    <p>Kes.534.00</p>
                    <span>Fund Transfer</span>
                </div>
                <div className="earn-item">
                    <p>Kes.534.00</p>
                    <span>Today's Earning</span>
                    
                </div>
                <div className="earn-item">
                    <span>Your Referrals</span>
                    <p>00</p>
                </div>
                <div className="earn-item">
                    <span>Active Referrals</span>
                    <p>00</p>
                </div>
                <div className="earn-item">
                    <span>Total Ref. Earnings</span>
                    <p>Kes.0.00</p>
                </div>
            </div>
        </div>
        </>
    );
};

export default Earn;
