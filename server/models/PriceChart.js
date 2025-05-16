const mongoose = require('mongoose');

const PriceChartSchema = new mongoose.Schema({
  id: Number,
  icon: String,
  name: String,
  price: String,
  notes: String,
});

module.exports = mongoose.model('PriceItem', PriceChartSchema);
