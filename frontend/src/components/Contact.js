import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/Styles/contact-us.css';
import AsideNavbar from './UI/AsideNavBar';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8081/api/contact', { name, email, message });

            if (response.data.success) {
                toast.success('Message sent successfully');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                toast.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <AsideNavbar/>
            <div>
                <form onSubmit={handleSubmit} className="contact-form">
                    <h4 style={{ display: 'flex', justifyContent: 'center', color: 'green' }}>Contact our Staff for assistance</h4>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
                <ToastContainer />
        </div>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Developed by @Wayne_Marwa</p>
        </>
    );
};

export default Contact;
