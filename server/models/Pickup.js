const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: String,
  scrapType: String,
  quantity: String,
  preferredDate: String,
  preferredTime: String,
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
    default: null
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

// Update the updatedAt field before saving
pickupSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Pickup', pickupSchema);
