import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/aside-navbar.css';
import defaultImage from '../Assets/Images/icons8-user-default-64.png';

const AsideNavbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        image: defaultImage,
    });

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:8081/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8081/api/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser((prevUser) => ({
                ...prevUser,
                image: response.data.imagePath,
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleImageClick = () => {
        document.getElementById('profileImageInput').click();
    };

    return (
        <>
            <button className="menu-button" onClick={toggleSidebar}>
                ☰
            </button>
            <aside className={`aside-navbar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="profile">
                    <img
                        src={user.image || defaultImage}
                        alt="Profile"
                        className="profile-image"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <input
                        type="file"
                        id="profileImageInput"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    <div className="profile-details">
                        <h3>{`${user.first_name} ${user.last_name}`}</h3>
                        <p>{user.email}</p>
                    </div>
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
                <nav>
                    <ul>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/share">Share</Link></li>
                        <li><Link to="/earn">Earn</Link></li>
                        <li><Link to="/payment">Payment</Link></li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default AsideNavbar;
