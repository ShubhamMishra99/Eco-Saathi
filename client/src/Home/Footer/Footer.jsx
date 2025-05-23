import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';
import facebook from '../../assets/1.webp';
import instagram from '../../assets/2.png';
import youtube from '../../assets/3.png';
import twitter from '../../assets/4.jpg';
import linkedin from '../../assets/5.jpg';
import whatsapp from '../../assets/6.png';


const Footer = () => (
  <footer className="footer-main">
    <div className="footer-top">
      <div className="footer-brand">
        <img src={logo} alt="eco saathi logo" className="footer-logo" />
        <div className="footer-brand-text">
          <span className="footer-brand-title">eco saathi<sup>™</sup></span>
          <span className="footer-brand-sub">connecting nature</span>
        </div>
        <p className="footer-desc">
India’s Premier Eco-Friendly Platform for Recycling Household & Office Waste!


        </p>
        <div className="footer-address">
          <strong>ADDRESS</strong><br />
          Plot No. : K-1/527, Kalinga Nagar, Ghatikia,<br />
          Bhubaneswar, Odisha - 751003
        </div>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h4>QUICK LINKS</h4>
          <a href="#">Shipping & Return Policy</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Refund Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="footer-col">
          <h4>ECOSAATHI</h4>
          <a href="#">Contact Us</a>
          <a href="#">About Us</a>
          <a href="#">Shop</a>
        </div>
        <div className="footer-col">
          <h4>CONTACT INFO</h4>
          <div className="footer-socials">
            <a href="#"><i className="fab fa-facebook-f"></i><img src={facebook} alt="Facebook" /></a>
            <a href="#"><i className="fab fa-instagram"></i><img src={instagram} alt="Instagram" /></a>
            <a href="#"><i className="fab fa-youtube"></i><img src={youtube} alt="YouTube" /></a>
            <a href="#"><i className="fab fa-x-twitter"></i><img src={twitter} alt="Twitter" /></a>
            <a href="#"><i className="fab fa-linkedin-in"></i><img src={linkedin} alt="LinkedIn" /></a>
            <a href="#"><i className="fab fa-whatsapp"></i><img src={whatsapp} alt="WhatsApp" /></a>
          </div>
          <div className="footer-contact-details">
            <div><i className="fab fa-whatsapp"></i> 1122334455</div>
            <div><i className="far fa-envelope"></i> info@ecosaathi.com</div>
          </div>
          {/* <div className="footer-payment">
            <span>PAYMENT METHOD</span>
            <div className="footer-payment-icons">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
              <img src="https://img.icons8.com/color/48/000000/rupay.png" alt="RuPay" />
              <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" />
              <img src="https://img.icons8.com/color/48/000000/discover.png" alt="Discover" />
            </div>
          </div> */}
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <span>Copyright © {new Date().getFullYear()} Eco Saathi. All Rights Reserved.</span>
    </div>
  </footer>
);

export default Footer; 