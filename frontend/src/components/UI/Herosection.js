import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/home.css";
import Welcomepopup from "./Welcomepopup";
import { serverApi } from "../../config/serverAPI";
import axios from "axios"

const HeaderSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState('');

  // Function to set a cookie
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  };

  // Function to get a cookie
  const getCookie = (name) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let index = 0; index < cookies.length; index++) {
      let cookie = cookies[index].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  };

  useEffect(() => {
    // check if welcome message has been shown before
    const welcome = getCookie("welcome");
    if (!welcome) {
      setShowModal(true);
      // set a cookie to remember that welcome message has been shown
      setCookie("welcome", "true", 365); // cookie expires in 365 days
    }

    fetchData();
  }, []);

  const handlePopupClose = () => {
    setShowModal(false);
  };

  // Fetch user details
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get(`${serverApi}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data);
      // console.log(userResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  //   console.log(user)



  return (
    <>
      <div>
        <Welcomepopup isOpen={showModal} onClose={handlePopupClose} />
      </div>
      <section id="header-section">
        <div
          className="cover g-bg-img-hero cover g-flex-centered g-pos-rel g-py-100"
          id="cover-picture-GRC004-0"
        >
          <div className="button-container">
            {
              user?.id ? (<>
                <Link to="/dashboard" className="button">
                  Go to Dashboard
                </Link>
              </>) : (
                <>
                  <Link to="/login" className="button">
                    Login
                  </Link>
                  <Link to="/signup" className="button">
                    Sign Up
                  </Link>
                </>
              )
            }


          </div>
          <div className="container text-center g-color-white g-py-20 g-mb-40 g-z-index-1 g-pos-rel--sm g-top-100">
            <h1
              className="g-color-white d-inline-block g-font-weight-700 g-font-size-25--sx g-font-size-30--md--down g-font-size-45--lg text-uppercase g-line-height-1 g-py-10 g-mb-20 fadeInUp"
              style={{
                animationDuration: "1500ms",
                color: "#00d134",
                fontSize: "30px",
              }}
            >
              Refer our services and Earn extra cash!
            </h1>
            <div className="d-inline-block g-width-50x g-height-2 g-bg-secondary mb-2"></div>
            <p
              className="g-color-white g-font-size-22 g-mb-5 fadeInUp"
              style={{ animationDuration: "1500ms", animationDelay: "800ms" }}
            >
              Do you want to make some extra money?
            </p>
            <p
              className="g-color-white g-font-size-22 g-mb-40 fadeInUp"
              style={{ animationDuration: "1500ms", animationDelay: "800ms" }}
            >
              Tell your family and friends about us and enjoy investing!
            </p>
            <div
              className="fadeInUp"
              style={{ animationDuration: "1500ms", animationDelay: "1100ms" }}
            ></div>
            <a href="/signup" className="signup-button">
              Click To Invest
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeaderSection;
