
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/home.css';

const HeaderSection = () => {
    return (
        <section id="header-section">
            <div className="cover g-bg-img-hero cover g-flex-centered g-pos-rel g-py-100" id="cover-picture-GRC004-0">
                <div className="button-container">
                    <Link to="/login" className="button">Login</Link>
                    <Link to="/signup" className="button">Sign Up</Link>
                </div>
                <div className="container text-center g-color-white g-py-20 g-mb-40 g-z-index-1 g-pos-rel--sm g-top-100">
                    <h3 className="g-color-white d-inline-block g-font-weight-700 g-font-size-25--sx g-font-size-30--md--down g-font-size-45--lg text-uppercase g-line-height-1 g-py-10 g-mb-20 fadeInUp"
                        style={{ animationDuration: '1500ms', color: '#00d134', fontSize: '30px' }}>
                        Refer our services and Earn extra cash!
                    </h3>
                    <div className="d-inline-block g-width-50x g-height-2 g-bg-secondary mb-2"></div>
                    <p className="g-color-white g-font-size-22 g-mb-5 fadeInUp"
                        style={{ animationDuration: '1500ms', animationDelay: '800ms' }}>
                        Do you want to make some extra money?
                    </p>
                    <p className="g-color-white g-font-size-22 g-mb-40 fadeInUp"
                        style={{ animationDuration: '1500ms', animationDelay: '800ms' }}>
                        Tell your family and friends about us and enjoy investing!
                    </p>
                    <div className="fadeInUp" style={{ animationDuration: '1500ms', animationDelay: '1100ms' }}></div>
                    <a href="/signup" className="signup-button">Click To Invest</a>
                </div>
            </div>
        </section>
    );
};

export default HeaderSection;