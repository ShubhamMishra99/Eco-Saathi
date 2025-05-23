import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about-section" className="about-section">
      <div className="about-header">
        <h2>WHY CHOOSE EcoSaathi?</h2>
      </div>
      <div className="about-features">
        <div className="feature-card">
          <div className="feature-icon">
            <img src="https://img.icons8.com/color/96/money.png" alt="Best Rates Icon" />
          </div>
          <h3 className="feature-title">Best Rates</h3>
          <span className="underline"></span>
          <p className="feature-description">We provide the best value for your scrap from our network of recyclers.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <img src="https://img.icons8.com/color/96/checked.png" alt="Convenience Icon" />
          </div>
          <h3 className="feature-title">Convenience</h3>
          <span className="underline"></span>
          <p className="feature-description">Doorstep pickup according to the user's convenient date & time.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <img src="https://img.icons8.com/color/96/security-checked.png" alt="Trust Icon" />
          </div>
          <h3 className="feature-title">Trust</h3>
          <span className="underline"></span>
          <p className="feature-description">Trained & verified pickup staff with smart weighing scales.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <img src="https://media.istockphoto.com/id/1359659563/vector/planet-earth-with-leaves-in-a-circle-green-globe-environmental-social-governance.jpg?s=612x612&w=0&k=20&c=AyyUx4eRlEBaig3Va-aFLFuOGHBxXBNJ7SHQqTWBkYg=" alt="Eco-friendly Icon" />
          </div>
          <h3 className="feature-title">Eco-friendly</h3>
          <span className="underline"></span>
          <p className="feature-description">We ensure responsible recycling of your scrap items.</p>
        </div>
      </div>
    </section>
  );
};

export default About;