const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  vehicleType: { 
    type: String, 
    required: true, 
    enum: ['mini_truck', 'pickup_van', 'e_rickshaw', 'cargo_bike'] 
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalPickups: {
    type: Number,
    default: 0
  },
  completedPickups: {
    type: Number,
    default: 0
  },
  rewardPoints: {
    type: Number,
    default: 0
  },
  licenseNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Rider', riderSchema);
