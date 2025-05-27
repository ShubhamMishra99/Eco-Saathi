import React, { useState } from 'react';
import './PriceChart.css';

const PriceChart = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock data for price chart
  const priceData = [
    {
      category: 'Paper & Cardboard',
      items: [
        { name: 'Old Newspapers', price: '₹8-12/kg' },
        { name: 'Office Paper', price: '₹10-15/kg' },
        { name: 'Old Magazines', price: '₹6-10/kg' },
        { name: 'Old Books', price: '₹5-8/kg' },
        { name: 'Cardboard Boxes', price: '₹7-11/kg' }
      ]
    },
    {
      category: 'Plastic',
      items: [
        { name: 'Water Bottles', price: '₹20-25/kg' },
        { name: 'Milk Jugs', price: '₹25-30/kg' },
        { name: 'Plastic Pipes', price: '₹15-20/kg' },
        { name: 'Food Containers', price: '₹18-22/kg' },
        { name: 'Plastic Bags', price: '₹12-15/kg' },
        { name: 'Plastic Boxes', price: '₹15-20/kg' }
      ]
    },
    {
      category: 'Metal',
      items: [
        { name: 'Copper Wire', price: '₹400-450/kg' },
        { name: 'Aluminum Cans', price: '₹120-150/kg' },
        { name: 'Brass Items', price: '₹300-350/kg' },
        { name: 'Stainless Steel', price: '₹80-100/kg' },
        { name: 'Lead Items', price: '₹150-180/kg' },
        { name: 'Zinc Items', price: '₹200-250/kg' }
      ]
    },
    {
      category: 'Electronics',
      items: [
        { name: 'Old Mobile Phones', price: '₹100-200/unit' },
        { name: 'Old Laptops', price: '₹500-1000/unit' },
        { name: 'Old Printers', price: '₹200-400/unit' },
        { name: 'Old TVs', price: '₹300-600/unit' },
        { name: 'Old Batteries', price: '₹50-100/kg' }
      ]
    },
    {
      category: 'Glass',
      items: [
        { name: 'Clear Glass Bottles', price: '₹5-8/kg' },
        { name: 'Colored Glass Bottles', price: '₹3-6/kg' },
        { name: 'Old Mirrors', price: '₹8-12/kg' }
      ]
    },
    {
      category: 'Textiles',
      items: [
        { name: 'Old Cotton Clothes', price: '₹15-20/kg' },
        { name: 'Old Synthetic Clothes', price: '₹10-15/kg' },
        { name: 'Old Woolen Clothes', price: '₹25-30/kg' }
      ]
    },
    {
      category: 'Rubber',
      items: [
        { name: 'Old Tires', price: '₹20-25/kg' },
        { name: 'Old Rubber Items', price: '₹15-20/kg' }
      ]
    },
    {
      category: 'Wood',
      items: [
        { name: 'Old Plywood', price: '₹8-12/kg' },
        { name: 'Old Furniture', price: '₹10-15/kg' },
        { name: 'Old Wooden Boxes', price: '₹5-8/kg' }
      ]
    }
  ];

  const filteredData = activeCategory === 'all'
    ? priceData
    : priceData.filter(category => category.category === activeCategory);

  return (
    <div className="price-chart-container">
      <div className="price-chart-header">
        <h2>Current Scrap Prices</h2>
        <p>Check the current market rates for different recyclable materials</p>
      </div>

      <div className="category-select">
        <select 
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="category-dropdown"
        >
          <option value="all">All Categories</option>
          {priceData.map(category => (
            <option key={category.category} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>
      </div>

      <div className="price-grid">
        {filteredData.map(category => (
          <div key={category.category} className="price-category">
            <h3>{category.category}</h3>
            <div className="price-items">
              {category.items.map(item => (
                <div key={item.name} className="price-item">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="price-note">
        <i className="fas fa-info-circle"></i>
        <p>
          Prices are subject to change based on market conditions and material quality.
          Contact us for bulk pickup rates and special arrangements.
        </p>
      </div>
    </div>
  );
};

export default PriceChart; 