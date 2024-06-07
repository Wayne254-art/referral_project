

// frontend/src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverApi } from '../config/serverAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsideNavbar from './UI/AdminAsideNavBar';
import '../components/Styles/admin-dashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalWithdrawals, setTotalWithdrawals] = useState(0);

    const navigate= useNavigate()

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const StatusResponse = await axios.get(`${serverApi}/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (StatusResponse.data.role !== 'Admin') {
                    navigate('/dashboard')

                }

                // console.log(StatusResponse.data)

                const [usersResponse, referralsResponse, depositsResponse, withdrawalsResponse] = await Promise.all([
                    axios.get(`${serverApi}/admin/users`, { headers }),
                    axios.get(`${serverApi}/admin/referrals`, { headers }),
                    axios.get(`${serverApi}/admin/deposits`, { headers }),
                    axios.get(`${serverApi}/admin/withdrawals`, { headers })
                ]);

                setUsers(usersResponse.data);
                // setReferrals(referralsResponse.data);
                // setTotalDeposits(depositsResponse.data.totalDeposits);
                // setTotalWithdrawals(withdrawalsResponse.data.totalWithdrawals);


            } catch (error) {
                console.error('Error fetching admin data:', error);
                toast.error('Error fetching admin data.');
            }
        };

        fetchAdminData();
    }, []);

    console.log(users)

    const [selectedUser, setSelectedUser] = useState(null);

    const handleViewMore = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className="admin-dashboard">
            <AsideNavbar />
            <div className="dashboard-content">
                <h1>Admin Dashboard</h1>
                <div className="stats">
                    <div className="stat-item">
                        <h3>Total Deposits</h3>
                        <p>Kes. {totalDeposits}</p>
                    </div>
                    <div className="stat-item">
                        <h3>Total Withdrawals</h3>
                        <p>Kes. {totalWithdrawals}</p>
                    </div>
                </div>
                <div className="table-container">
                    <h2>Users</h2>
                    <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Is Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => handleViewMore(user)}>View More</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                </div>
                <div className="table-container">
                    <h2>Referrals</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Referrer ID</th>
                                <th>Referral Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map(referral => (
                                <tr key={referral.id}>
                                    <td>{referral.id}</td>
                                    <td>{referral.userId}</td>
                                    <td>{new Date(referral.referralDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdminDashboard;
