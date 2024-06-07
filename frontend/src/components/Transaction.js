import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/Styles/transaction.css";
import AsideNavbar from "./UI/AsideNavBar";
import { serverApi } from "../config/serverAPI";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  // const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralCount, setReferralCount] = useState("");
  const [intrest, setInterest] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0);

  const navigate = useNavigate();

  const handleWithdraw = async (e) => {
    e.preventDefault();

    // Check if the amount is at least 200
    if (parseFloat(amount) < 200) {
      toast.error("The minimum withdrawal amount is 200.");
      return;
    }

    if (amount > ultimateBalance) {
      toast.error("Withdrawal amount can't be greater than Actual Balance.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to be logged in to perform this action.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8081/api/withdraw",
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Withdrawal successful");
        setAmount("");
      } else {
        toast.error("Withdrawal failed");
      }
    } catch (error) {
      console.error("Error during withdrawal:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
          const depositsResponse = await axios.get(`${serverApi}/deposits/total`, { headers });
                setTotalDeposits(depositsResponse.data.totalDeposits);



        const [balanceResponse, referraluserCountResponse] = await Promise.all([
          axios.get(`${serverApi}/user/balance`, { headers }),
          axios.get(`${serverApi}/referrals/earnings`, { headers }),
          
        ]);

        // setBalance(balanceResponse.data.balance);
        setReferralCount(referraluserCountResponse.data.referralCount);
        const calculatedInterest = totalDeposits * 0.2;
        setInterest(calculatedInterest);

        // setBalance(400);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again.");
      }
    };

    fetchData();
  }, [navigate, totalDeposits]);

  // const data = orders && orders.find((item) => item._id === id);
  
const balance = referralCount * 50;
const  ultimateBalance = (balance + intrest) || 0;

    console.log(" balance",balance)
    console.log("Ultimate balance",ultimateBalance)
    console.log('total Deposits',totalDeposits)
    console.log('total referal count',referralCount)
    console.log('Interest',intrest)

  return (
    <>
      <AsideNavbar />

      <form onSubmit={handleWithdraw} className="transaction-form">
        <h1>Withdraw Funds</h1>

        <h2>
          Account Balance: <span>Kes.{ultimateBalance.toFixed(2)}</span>
        </h2>

        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (Minimum is 200)"
          required
        />
        <button
          type="submit"
          disabled={loading || ultimateBalance <= 199}
          title={ultimateBalance <= 199 ? "Insufficient balance to withdraw" : ""}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </form>
      <ToastContainer />
      <p
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Developed by @Wayne_Marwa
      </p>
    </>
  );
};

export default Transaction;
