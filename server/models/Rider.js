const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  username: { type: String, required: true },   // matches frontend username
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rider', riderSchema);
