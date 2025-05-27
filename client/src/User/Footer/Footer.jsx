import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><i className="fas fa-phone"></i> +91 1234567890</p>
          <p><i className="fas fa-envelope"></i> support@Eco-Saathi.com</p>
          <p><i className="fas fa-map-marker-alt"></i> Mumbai, Maharashtra</p>
        </div>
        
        <div className="footer-section">
          <h4>Working Hours</h4>
          <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
          <p>Sunday: Closed</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <p><a href="#request">Request Pickup</a></p>
          <p><a href="#rewards">Rewards Program</a></p>
          <p><a href="#about">About Us</a></p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#facebook"><i className="fab fa-facebook"></i></a>
            <a href="#twitter"><i className="fab fa-twitter"></i></a>
            <a href="#instagram"><i className="fab fa-instagram"></i></a>
            <a href="#linkedin"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Eco-Saathi. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 