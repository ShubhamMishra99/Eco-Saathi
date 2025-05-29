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

// Helper function to calculate reward breakdown
const calculateRewardBreakdown = (actualQuantity) => {
  const basePoints = Math.floor(actualQuantity * 10);
  const bonusPoints = Math.floor(actualQuantity / 10) * 50;
  
  return {
    basePoints,
    bonusPoints,
    total: basePoints + bonusPoints,
    breakdown: {
      perKgPoints: `${actualQuantity} kg × 10 points = ${basePoints} points`,
      tenKgBonus: actualQuantity >= 10 ? 
        `${Math.floor(actualQuantity / 10)} × 50 bonus points = ${bonusPoints} points` : 
        'No bonus (less than 10kg)',
    }
  };
};

// Complete pickup request
router.post('/complete-pickup', async (req, res) => {
  try {
    const { pickupId, actualQuantity, notes } = req.body;
    const riderId = req.rider.id;

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

    // Calculate reward points and breakdown
    const rewardCalculation = calculateRewardBreakdown(actualQuantity);

    // Update the order
    const order = await Order.findOne({ pickup: pickupId });
    if (order) {
      order.status = 'completed';
      order.actualWeight = actualQuantity;
      order.notes = notes;
      order.amount = 5; // Set fixed amount of ₹5 for each completed pickup
      order.rewardPoints = rewardCalculation.total;
      await order.save();
    }

    // Emit socket event to notify user
    if (req.app.get('io')) {
      req.app.get('io').emit('pickup-status-update', {
        pickupId,
        status: 'completed',
        actualQuantity,
        notes,
        amount: 5,
        rewardPoints: rewardCalculation.total,
        rewardBreakdown: rewardCalculation.breakdown
      });
    }

    res.json({ 
      message: 'Pickup completed successfully', 
      pickup,
      order,
      rewardPoints: rewardCalculation.total,
      rewardBreakdown: rewardCalculation.breakdown
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

// Get rider statistics
router.get('/statistics', async (req, res) => {
  try {
    const riderId = req.rider.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all pickups and orders for this rider
    const [allOrders, todayOrders, allPickups] = await Promise.all([
      Order.find({ rider: riderId }).populate('pickup'),
      Order.find({
        rider: riderId,
        createdAt: { $gte: today }
      }),
      Pickup.find({ rider: riderId })
    ]);

    // Calculate earnings (₹5 per completed pickup)
    const completedOrders = allOrders.filter(order => order.status === 'completed');
    const todayCompletedOrders = todayOrders.filter(order => order.status === 'completed');

    // Calculate reward points based on actual weight
    let rewardPoints = 0;
    completedOrders.forEach(order => {
      if (order.actualWeight) {
        // Base points: 10 points per kg
        rewardPoints += Math.floor(order.actualWeight * 10);
        
        // Bonus points: 50 points for every 10kg
        rewardPoints += Math.floor(order.actualWeight / 10) * 50;
      }
    });

    // Monthly consistency bonus (100 points)
    // Get the first day of current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyOrders = await Order.find({
      rider: riderId,
      status: 'completed',
      createdAt: { $gte: firstDayOfMonth }
    });
    
    // If there's at least one completed order this month
    if (monthlyOrders.length > 0) {
      rewardPoints += 100;
    }

    // Special achievements (200 points for every 100kg milestone)
    const totalWeight = completedOrders.reduce((sum, order) => sum + (order.actualWeight || 0), 0);
    const milestones = Math.floor(totalWeight / 100);
    rewardPoints += milestones * 200;
    
    const statistics = {
      totalPickups: allPickups.length,
      completedPickups: allPickups.filter(pickup => pickup.status === 'completed').length,
      pendingPickups: allPickups.filter(pickup => pickup.status === 'accepted').length,
      completedToday: todayCompletedOrders.length,
      todayEarnings: todayCompletedOrders.length * 5, // ₹5 per completed pickup today
      totalEarnings: completedOrders.length * 5, // ₹5 per completed pickup total
      rewardPoints: rewardPoints,
      totalWeight: totalWeight
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
});

// Profile routes
router.get('/profile', RiderController.getProfile);
router.put('/profile', RiderController.updateProfile);
router.put('/change-password', RiderController.changePassword);
router.put('/availability', RiderController.updateAvailability);

module.exports = router;
