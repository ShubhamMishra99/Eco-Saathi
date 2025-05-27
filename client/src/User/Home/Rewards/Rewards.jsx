import React from 'react';
import './Rewards.css';

const Rewards = () => {
  const rewards = [
    {
      id: 1,
      name: 'Eco Warrior Badge',
      points: 100,
      description: 'Special badge for your profile showcasing your environmental commitment',
      image: '🏆'
    },
    {
      id: 2,
      name: 'Monthly Champion',
      points: 500,
      description: 'Special recognition for being the top recycler of the month',
      image: '🌟'
    },
    {
      id: 3,
      name: 'Premium Membership',
      points: 2000,
      description: '1 month of premium membership with priority pickup and exclusive benefits',
      image: '👑'
    },
    {
      id: 4,
      name: '₹500 Cash Reward',
      points: 5000,
      description: 'Get ₹500 cash reward for your recycling efforts',
      image: '💰'
    }
  ];

  return (
    <div className="rewards-section">
      <div className="rewards-header">
        <h2>Rewards Center</h2>
        <div className="points-display">
          <i className="fas fa-star"></i>
          <span>Your Points: 0</span>
        </div>
      </div>

      <div className="rewards-info">
        <h3>How to Earn Points</h3>
        <div className="points-info-grid">
          <div className="points-info-card">
            <i className="fas fa-recycle"></i>
            <h4>Regular Pickups</h4>
            <p><strong>10 points</strong> for every 1 kg of recyclable material</p>
            <p><strong>+50 points</strong> bonus for every 10 kg</p>
          </div>
          <div className="points-info-card">
            <i className="fas fa-calendar-check"></i>
            <h4>Monthly Streak</h4>
            <p><strong>100 points</strong> for monthly consistency</p>
          </div>
          <div className="points-info-card">
            <i className="fas fa-award"></i>
            <h4>Special Achievements</h4>
            <p><strong>200 points</strong> for special recycling milestones</p>
          </div>
          <div className="points-info-card">
            <i className="fas fa-share-alt"></i>
            <h4>Refer Friends</h4>
            <p><strong>1000 points</strong> per successful referral</p>
          </div>
        </div>
      </div>

      <div className="available-rewards">
        <h3>Available Rewards</h3>
        <div className="rewards-grid">
          {rewards.map(reward => (
            <div key={reward.id} className="reward-card">
              <div className="reward-image">{reward.image}</div>
              <h4>{reward.name}</h4>
              <p>{reward.description}</p>
              <div className="reward-points">
                <i className="fas fa-star"></i>
                <span>{reward.points} points</span>
              </div>
              <button 
                className="redeem-button"
                disabled={true} // Disabled when user doesn't have enough points
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards; 