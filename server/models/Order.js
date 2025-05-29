const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  pickup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'accepted'
  },
  scrapType: String,
  quantity: String,
  address: String,
  preferredDate: String,
  preferredTime: String,
  notes: String,
  actualWeight: {
    type: Number,
    default: null
  },
  amount: {
    type: Number,
    default: 0
  },
  rewardPoints: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema); 