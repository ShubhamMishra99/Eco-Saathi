import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h2>About EasyScrap</h2>
        <p>Your trusted partner in sustainable waste management</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <div className="section-icon">
            <i className="fas fa-recycle"></i>
          </div>
          <h3>Our Mission</h3>
          <p>
            At EasyScrap, we're committed to making waste management simple, efficient, and environmentally friendly. 
            We connect scrap collectors with customers, ensuring proper recycling and disposal of materials.
          </p>
        </div>

        <div className="about-section">
          <div className="section-icon">
            <i className="fas fa-truck"></i>
          </div>
          <h3>For Riders</h3>
          <p>
            As a rider, you play a crucial role in our mission. You help collect and transport recyclable materials, 
            ensuring they reach the right processing facilities. We provide you with the tools and support needed 
            to manage your pickups efficiently.
          </p>
        </div>

        <div className="about-section">
          <div className="section-icon">
            <i className="fas fa-handshake"></i>
          </div>
          <h3>Our Commitment</h3>
          <p>
            We're dedicated to providing a reliable and transparent service. Our platform ensures fair compensation 
            for riders and convenient service for customers, all while promoting environmental sustainability.
          </p>
        </div>

        <div className="about-section">
          <div className="section-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3>Safety & Quality</h3>
          <p>
            Your safety is our priority. We maintain strict quality standards and provide necessary training to ensure 
            safe handling of materials. Our platform includes features for tracking and managing pickups securely.
          </p>
        </div>
      </div>

      <div className="about-stats">
        <div className="stat-item">
          <i className="fas fa-users"></i>
          <div className="stat-info">
            <h4>Active Riders</h4>
            <p>500+</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fas fa-map-marker-alt"></i>
          <div className="stat-info">
            <h4>Cities Covered</h4>
            <p>25+</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fas fa-truck-loading"></i>
          <div className="stat-info">
            <h4>Daily Pickups</h4>
            <p>1000+</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fas fa-leaf"></i>
          <div className="stat-info">
            <h4>Tons Recycled</h4>
            <p>5000+</p>
          </div>
        </div>
      </div>

      <div className="about-contact">
        <h3>Need Help?</h3>
        <p>Our support team is available 24/7 to assist you with any questions or concerns.</p>
        <button className="contact-button">
          <i className="fas fa-headset"></i>
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default About; 