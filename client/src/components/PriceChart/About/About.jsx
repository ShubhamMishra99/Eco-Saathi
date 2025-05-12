import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about-section" className="about-section">
      <h2>WHY CHOOSE EcoSaathi?</h2>
      <div className="about-grid">
        <div className="about-card">
          <img src="https://img.icons8.com/color/96/money.png" alt="Best Rates" />
          <h3>Best Rates</h3>
          <p>We provide the best value for your scrap from our network of recyclers.</p>
        </div>
        <div className="about-card">
          <img src="https://img.icons8.com/color/96/checked.png" alt="Convenience" />
          <h3>Convenience</h3>
          <p>Doorstep pickup according to the user's convenient date & time.</p>
        </div>
        <div className="about-card">
          <img src="https://img.icons8.com/color/96/security-checked.png" alt="Trust" />
          <h3>Trust</h3>
          <p>Trained & verified pickup staff with smart weighing scales.</p>
        </div>
        <div className="about-card">
          <img src="https://media.istockphoto.com/id/1359659563/vector/planet-earth-with-leaves-in-a-circle-green-globe-environmental-social-governance.jpg?s=612x612&w=0&k=20&c=AyyUx4eRlEBaig3Va-aFLFuOGHBxXBNJ7SHQqTWBkYg=" alt="Eco-friendly" />
          <h3>Eco-friendly</h3>
          <p>We ensure responsible recycling of your scrap items.</p>
        </div>
      </div>
    </section>
  );
};

export default About;