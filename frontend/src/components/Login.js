// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { serverApi } from '../config/serverAPI';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverApi}/login`, { identifier, password } , {withCredentials: true});
            localStorage.setItem('token', res.data.token);
                navigate('/payment');
             } catch (error) {
            console.error(error);
            toast.error('Login failed. Please check your credentials and try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="cover g-bg-img-hero cover g-flex-centered g-pos-rel g-py-100" id="cover-picture-GRC004-0">
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleLogin} style={{ animationDuration: '1500ms', color: '#00d134' }}>
                <h1 style={{ display: 'flex', justifyContent: 'center' }}>Welcome Back!</h1>
                <h4 style={{ display: 'flex', justifyContent: 'center' }}>Login with your details to continue</h4>
                <input
                    type="text"
                    placeholder="Email, Username or Phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Don't have an account? <a href="/signup" className="signup-link">Signup</a></p>
            </form>
            <ToastContainer />
        </div>
        </div>
    );
};

export default Login;
