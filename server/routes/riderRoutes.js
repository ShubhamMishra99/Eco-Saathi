const express = require('express');
const router = express.Router();
const RiderController = require('../controllers/riderController');
const Pickup = require('../models/Pickup');
const Order = require('../models/Order');
const { protectRider } = require('../middleware/userMiddleware');

// Public routes
router.post('/signup', RiderController.signup);
router.post('/login', RiderController.login);

// Protected routes - require authentication
router.use(protectRider); // Use the correct rider auth middleware

// Accept pickup request
router.post('/accept-pickup', async (req, res) => {
  try {
    const { pickupId } = req.body;
    const riderId = req.rider.id; // Get rider ID from auth token

    // Find the pickup request and populate user details
    const pickup = await Pickup.findById(pickupId).populate('user');
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // Check if pickup is already accepted or declined
    if (pickup.status !== 'pending') {
      return res.status(400).json({ 
        message: `Pickup request has already been ${pickup.status}` 
      });
    }

    // Update pickup status
    pickup.status = 'accepted';
    pickup.rider = riderId;
    await pickup.save();

    // Create a new order
    const order = new Order({
      pickup: pickupId,
      user: pickup.user._id,
      rider: riderId,
      status: 'accepted',
      scrapType: pickup.scrapType,
      quantity: pickup.quantity,
      address: pickup.address,
      preferredDate: pickup.preferredDate,
      preferredTime: pickup.preferredTime,
      notes: pickup.notes
    });

    await order.save();

    // Emit socket event to notify user
    if (req.app.get('io')) {
      req.app.get('io').emit('pickup-status-update', {
        pickupId,
        status: 'accepted',
        riderId,
        orderId: order._id
      });
    }

    res.json({ 
      message: 'Pickup request accepted successfully', 
      pickup,
      order 
    });
  } catch (error) {
    console.error('Error accepting pickup:', error);
    res.status(500).json({ 
      message: 'Failed to accept pickup request',
      error: error.message 
    });
  }
});

// Complete pickup request
router.post('/complete-pickup', async (req, res) => {
  try {
    const { pickupId, actualQuantity, notes } = req.body;
    const riderId = req.rider.id; // Use req.rider instead of req.user

    // Find the pickup request and related order
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // Check if pickup belongs to this rider
    if (pickup.rider.toString() !== riderId) {
      return res.status(403).json({ message: 'Not authorized to complete this pickup' });
    }

    // Check if pickup is in accepted status
    if (pickup.status !== 'accepted') {
      return res.status(400).json({ 
        message: `Cannot complete pickup that is in ${pickup.status} status` 
      });
    }

    // Update pickup status
    pickup.status = 'completed';
    await pickup.save();

    // Update the order
    const order = await Order.findOne({ pickup: pickupId });
    if (order) {
      order.status = 'completed';
      order.actualWeight = actualQuantity;
      order.notes = notes;
      // You might want to calculate the amount based on the actual quantity and scrap type
      // order.amount = calculateAmount(actualQuantity, pickup.scrapType);
      await order.save();
    }

    // Emit socket event to notify user
    if (req.app.get('io')) {
      req.app.get('io').emit('pickup-status-update', {
        pickupId,
        status: 'completed',
        actualQuantity,
        notes
      });
    }

    res.json({ 
      message: 'Pickup completed successfully', 
      pickup,
      order 
    });
  } catch (error) {
    console.error('Error completing pickup:', error);
    res.status(500).json({ 
      message: 'Failed to complete pickup',
      error: error.message 
    });
  }
});

// Decline pickup request
router.post('/decline-pickup', async (req, res) => {
  try {
    const { pickupId } = req.body;

    // Find and update the pickup request
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // Check if pickup is already accepted or declined
    if (pickup.status !== 'pending') {
      return res.status(400).json({ 
        message: `Pickup request has already been ${pickup.status}` 
      });
    }

    pickup.status = 'declined';
    await pickup.save();

    // Emit socket event to notify user
    if (req.app.get('io')) {
      req.app.get('io').emit('pickup-status-update', {
        pickupId,
        status: 'declined'
      });
    }

    res.json({ message: 'Pickup request declined successfully', pickup });
  } catch (error) {
    console.error('Error declining pickup:', error);
    res.status(500).json({ 
      message: 'Failed to decline pickup request',
      error: error.message 
    });
  }
});

// Get rider's orders
router.get('/orders', async (req, res) => {
  try {
    const riderId = req.rider.id;
    const orders = await Order.find({ rider: riderId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'pickup',
        select: '_id status scrapType quantity address preferredDate preferredTime notes'
      })
      .populate('user', 'name phone');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
});

module.exports = router;
