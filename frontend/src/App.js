import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import axios from 'axios';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import Share from './components/Share';
import Earn from './components/Earn';
import Payment from './components/Payment'
import ProceedForm from './components/ProceedForm';
import Transaction from './components/Transaction';
import Contact from './components/Contact';
import Popup from './components/Popup';
import AdminDashboard from './components/AdminDashboard';
import Mail from './components/Mail';

const App = () => {
    const [user, setUser] = useState(null);
    

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8081/api/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);
    
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard user={user} />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Home />} />
                <Route path="/share" element={<Share user={user} />} />
                <Route path="/earn/:id" element={<Earn />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/proceedform" element={<ProceedForm />} />
                <Route path="/transaction" element={<Transaction/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/popup" element={<Popup/>} />
                <Route path="/admindashboard" element={<AdminDashboard/>} />
                <Route path="/mail" element={<Mail/>} />
            </Routes>
        </Router>
    );
};

export default App;
