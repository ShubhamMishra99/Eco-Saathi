// src/components/PriceChart/PriceChart.jsx
import React from 'react';
import { priceChartItems, formatNote } from './priceChartData'; // Import data and helper
import '../../styles/PriceChart/PriceChart.css'; // Import specific styles

function PriceChart() {
  return (
    <section id="price-chart-section" className="price-chart-container">
      <h2 className="price-chart-title">Normal Recyclables</h2>
      <div className="price-chart-grid">
        {priceChartItems.map((item) => (
          <div key={item.id} className="price-card">
            <div className="price-card-icon">{item.icon}</div>
            <div className="price-card-price">{item.price}</div>
            <div className="price-card-name">{item.name}</div>
            {item.notes && (
              <div className="price-card-notes">
                {formatNote(item.notes)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PriceChart;
