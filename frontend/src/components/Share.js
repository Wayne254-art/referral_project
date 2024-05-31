import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles/share.css';
import AsideNavbar from './UI/AsideNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faWhatsapp, faTelegram, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import QRCode from 'qrcode.react';

const Share = ({ user }) => {

    if (!user) {
        toast.error('User data not available. Please log in.');
        return (
            <div>
                <ToastContainer />
            </div>
        );
    }

    const referralLink = `https://vauxrefers.com/signup?ref=${user.username}&referral=${user.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Referral link copied to clipboard!');
    };

    return (
        <>
            <AsideNavbar user={user} />
            <div className="main-content">
                <div className="referral-share-container">
                    <h1>Share and Earn!</h1>
                    <p>Share the link below with your friends and earn rewards when they sign up:</p>
                    <input className="referral-link-input" type="text" value={referralLink} readOnly />
                    <button onClick={handleCopyLink} className="copy-button">Copy Link</button>
                    <ToastContainer />
                </div>
                <div className="referral-share-container">
                    <h3>Earn Extra Cash Now!</h3>
                    <p>Share on social media to earn more money:</p>
                    <div className="social-share">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} size="2x" />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=Check%20this%20out!`} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} size="2x" />
                        </a>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} size="2x" />
                        </a>
                        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                        </a>
                        <a href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FontAwesomeIcon icon={faTelegram} size="2x" />
                        </a>
                        <a href={`fb-messenger://share?link=${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FontAwesomeIcon icon={faFacebookMessenger} size="2x" />
                        </a>
                    </div>
                </div>
                <div className="referral-share-container">
                    <div className="qr-code-container">
                        <p>Or scan the QR code:</p>
                        <QRCode value={referralLink} size={128} />
                    </div>
                </div>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Developed by @Wayne_Marwa</p>
            </div>
        </>
    );
};

export default Share;
