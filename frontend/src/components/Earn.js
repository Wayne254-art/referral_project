import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AsideNavbar from './UI/AsideNavBar';
import { serverApi } from '../config/serverAPI';
import '../components/Styles/earn.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Earn = () => {
    const navigate = useNavigate();
    const [totalWithdrawn, setTotalWithdrawn] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [referralEarnings, setReferralEarnings] = useState(0);
    const [interest, setInterest] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [referralCount, setReferralCount] = useState(0);
    const [fundTransfer, setFundTransfer] = useState(0);
    const [todaysEarnings, setTodaysEarnings] = useState(0);
    const [totalReferralsCount, setTotalReferralsCount] = useState(0);
    const [activeReferrals, setActiveReferrals] = useState(0);

    const {id} = useParams()



    // console.log('total Deposits',totalDeposits)
    // console.log('total withdrawn',totalWithdrawn)
    // console.log('total pending',pendingAmount)
    // console.log('total refferalEarning',referralEarnings)
    // console.log('total intrest b4',interest)
    // console.log('total bonus',bonus)
    // console.log('total referal count',referralCount)
    // console.log('totaltodays earning', todaysEarnings)
    // console.log('totaltodays fund transfer', fundTransfer)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };

                // Fetch total deposits and validate
                const depositsResponse = await axios.get(`${serverApi}/deposits/total`, { headers });
                const total = depositsResponse.data.totalDeposits;
                setTotalDeposits(total);

                if (total <= 499) {
                    toast.error('Please make payments first');
                    navigate('/payment');
                    return;
                }

                // Fetch other data concurrently
                const [
                    balanceResponse,
                    withdrawnResponse,
                    pendingResponse,
                    referralEarningsResponse,
                    referraluserCountResponse,
                    fundTransferResponse,
                    todaysEarningsResponse,
                    activeReferralsRsponse,
                    totalReferralsCountResponse,
                ] = await Promise.all([
                    axios.get(`${serverApi}/user/balance`, { headers }),
                    axios.get(`${serverApi}/user/total-withdrawn`, { headers }),
                    axios.get(`${serverApi}/withdrawals/pending`, { headers }),
                    axios.get(`${serverApi}/referrals/earnings`, { headers }),
                    axios.get(`${serverApi}/referrals/count`, { headers }),
                    axios.get('http://localhost:8081/api/transfers/amount', { headers }),
                    axios.get('http://localhost:8081/api/earnings/today', { headers }),
                    axios.get(`http://localhost:8081/api/active-referrals-count/${id}`,{headers}), 
                    axios.get(`http://localhost:8081/api/total-referrals-count/${id}`, {headers}), 
                ]);
                setTotalWithdrawn(withdrawnResponse.data.totalWithdrawn);
                setPendingAmount(pendingResponse.data.pendingAmount);
                setReferralEarnings(referralEarningsResponse.data.referralEarnings);
                setReferralCount(referraluserCountResponse.data.referralCount);
                setFundTransfer(fundTransferResponse.data.fundTransferAmount);
                setTodaysEarnings(todaysEarningsResponse.data.todaysEarnings);
                setActiveReferrals(3);
                setTotalReferralsCount(totalReferralsCountResponse.data.totalReferalCount);

                // Calculate and set interest
                const calculatedInterest = total * 0.2;
                setInterest(calculatedInterest);

                // console.log('total intrest after',interest)

                // Calculate and set bonus
                let calculatedBonus = 0;
                const count = activeReferrals;
                if (count >= 10) {
                    calculatedBonus = 100 + (50 * count);
                } else if (count >= 5) {
                    calculatedBonus = 50 + (50 * count);
                } else if (count >= 3) {
                    calculatedBonus = 20 + (50 * count);
                }
                setBonus(calculatedBonus);


            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data. Please try again.');
            }
        };

        fetchData();
    }, [navigate, interest,id,activeReferrals]);


const balance = activeReferrals * 50;
const  ultimateBalance = (balance+ interest + bonus) || 0;

// const withdrawalAmount = ultimat

// console.log(activeReferrals)


    return (
        <>
            <AsideNavbar />
            <div className="earn-page"style={{color: 'blue'}}>
                <div className="earn-container">
                    <div className="earn-item">
                        <h2>Kes.{ultimateBalance.toFixed(2)}</h2>
                        <span>Ultimate Balance</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{totalWithdrawn.toFixed(2)}</h2>
                        <span>Total Payout</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{totalDeposits.toFixed(2)}</h2>
                        <span>Total Deposit</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{pendingAmount.toFixed(2)}</h2>
                        <span>Pending withdrawal</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{interest.toFixed(2)}</h2>
                        <span>20% Bonus</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{bonus.toFixed(2)}</h2>
                        <span>Refferal Bonus</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{balance.toFixed(2)}</h2>
                        <span>Referral Earnings</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{fundTransfer.toFixed(2)}</h2>
                        <span>Total Withdrawn</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{todaysEarnings.toFixed(2)}</h2>
                        <span>Today's Earning</span>
                    </div>
                    <div className="earn-item">
                    <h2>{activeReferrals}</h2>
                        <span>Active Referrals</span>
                    </div>
                    <div className="earn-item">
                        <h2>{totalReferralsCount}</h2>
                        <span>Your Referrals</span>
                    </div>
                    <div className="earn-item">
                        <h2>Kes.{referralEarnings.toFixed(2)}</h2>
                        <span>Total Ref. Earnings</span>
                    </div>
                </div>
                <ToastContainer />
            </div>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Developed by @Wayne_Marwa</p>
        </>
    );
};

export default Earn;
