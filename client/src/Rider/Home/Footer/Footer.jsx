import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="rider-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#"><i className="fas fa-home"></i> Home</a></li>
            <li><a href="#"><i className="fas fa-book"></i> Guidelines</a></li>
            <li><a href="#"><i className="fas fa-question-circle"></i> FAQ</a></li>
            <li><a href="#"><i className="fas fa-headset"></i> Support</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="#"><i className="fas fa-file-alt"></i> Terms of Service</a></li>
            <li><a href="#"><i className="fas fa-lock"></i> Privacy Policy</a></li>
            <li><a href="#"><i className="fas fa-shield-alt"></i> Safety Guidelines</a></li>
            <li><a href="#"><i className="fas fa-gavel"></i> Compliance</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <i className="fas fa-phone"></i>
              <span>+91 1234567890</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>support@easyscrap.com</span>
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>Mumbai, Maharashtra</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 EasyScrap. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 