
// frontend/src/components/MailPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverApi } from '../config/serverAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsideNavbar from './UI/AdminAsideNavBar';
import '../components/Styles/mail-page.css';

const MailPage = () => {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.get(`${serverApi}/mails`, { headers });
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching emails:', error);
                toast.error('Error fetching emails.');
            }
        };

        fetchEmails();
    }, []);

    return (
        <div className="mail-page">
            <AsideNavbar />
            <div className="mail-content">
                <h1>Emails</h1>
                <div className="email-list">
                    {emails.length === 0 ? (
                        <p>No emails found.</p>
                    ) : (
                        emails.map((email) => (
                            <div key={email.id} className="email-item">
                                <h3>{email.subject}</h3>
                                <p>{email.body}</p>
                                <p><strong>From:</strong> {email.sender}</p>
                                <p><strong>To:</strong> {email.recipient}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MailPage;
