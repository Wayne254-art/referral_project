import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/sign-up.css"; // Import the CSS file
import { serverApi } from "../config/serverAPI";

const Signup = () => {
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/payment");
      return;
    } else {
      navigate("/signup");
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${serverApi}/signup`, {
        first_name,
        last_name,
        username,
        email,
        contact,
        password,
      });
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error("Already have an account");
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect after 2 seconds
      } else {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div
      className="cover g-bg-img-hero cover g-flex-centered g-pos-rel g-py-100"
      id="cover-picture-GRC004-0"
    >
      <div className="signup-container">
        <form
          className="signup-form"
          onSubmit={handleSignup}
          style={{ color: "#00d134" }}
        >
          <h4 style={{ display: "flex", justifyContent: "center" }}>
            Please fill in Your Personal Details to Continue
          </h4>
          <input
            type="text"
            placeholder="Firstname"
            value={first_name}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Lastname"
            value={last_name}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={contact}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
         
          <button type="submit">Signup</button>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Have an account?{" "}
            <a href="/login" className="signup-link">
              Signin
            </a>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
