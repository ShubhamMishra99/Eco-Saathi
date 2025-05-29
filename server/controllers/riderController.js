const Rider = require('../models/Rider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pickup = require('../models/Pickup');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new rider
// @route   POST /api/riders/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, vehicleNumber, vehicleType, licenseNumber } = req.body;

    // Check if rider exists
    const riderExists = await Rider.findOne({ email });
    if (riderExists) {
      return res.status(400).json({ message: 'Rider already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create rider
    const rider = await Rider.create({
      name,
      email,
      phone,
      password: hashedPassword,
      vehicleNumber,
      vehicleType,
      licenseNumber
    });

    if (rider) {
      res.status(201).json({
        _id: rider._id,
        name: rider.name,
        email: rider.email,
        phone: rider.phone,
        vehicleNumber: rider.vehicleNumber,
        vehicleType: rider.vehicleType,
        token: generateToken(rider._id),
      });
    }
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Failed to create rider account' });
  }
};

// @desc    Authenticate rider & get token
// @route   POST /api/riders/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for rider email
    const rider = await Rider.findOne({ email });
    if (!rider) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: rider._id,
      name: rider.name,
      email: rider.email,
      phone: rider.phone,
      vehicleNumber: rider.vehicleNumber,
      vehicleType: rider.vehicleType,
      token: generateToken(rider._id),
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// @desc    Get rider profile
// @route   GET /api/riders/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const rider = await Rider.findById(req.rider.id).select('-password');
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    // Get rider's pickups for statistics
    const pickups = await Pickup.find({ rider: rider._id });
    const completedPickups = pickups.filter(pickup => pickup.status === 'completed');

    const rewardPoints = completedPickups.reduce((total, pickup) => {
      // Base points (10 per kg)
      let points = Math.floor((pickup.actualWeight || 0) * 10);
      // Bonus points (50 points per 10kg)
      points += Math.floor((pickup.actualWeight || 0) / 10) * 50;
      return total + points;
    }, 0);

    res.json({
      name: rider.name,
      email: rider.email,
      phone: rider.phone,
      vehicleNumber: rider.vehicleNumber,
      vehicleType: rider.vehicleType,
      isEmailVerified: rider.isEmailVerified || false,
      isPhoneVerified: rider.isPhoneVerified || false,
      isAvailable: rider.isAvailable,
      rating: rider.rating,
      totalPickups: rider.totalPickups,
      completedPickups: rider.completedPickups,
      rewardPoints: rider.rewardPoints,
      joinedDate: rider.createdAt
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// @desc    Update rider profile
// @route   PUT /api/riders/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const rider = await Rider.findById(req.rider.id);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    const { name, email, phone, vehicleNumber, vehicleType } = req.body;

    // Check if email is being changed and if it's already taken
    if (email !== rider.email) {
      const emailExists = await Rider.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      rider.isEmailVerified = false; // Reset email verification if email is changed
    }

    // Check if phone is being changed
    if (phone !== rider.phone) {
      const phoneExists = await Rider.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
      rider.isPhoneVerified = false; // Reset phone verification if phone is changed
    }

    rider.name = name || rider.name;
    rider.email = email || rider.email;
    rider.phone = phone || rider.phone;
    rider.vehicleNumber = vehicleNumber || rider.vehicleNumber;
    rider.vehicleType = vehicleType || rider.vehicleType;

    const updatedRider = await rider.save();

    res.json({
      name: updatedRider.name,
      email: updatedRider.email,
      phone: updatedRider.phone,
      vehicleNumber: updatedRider.vehicleNumber,
      vehicleType: updatedRider.vehicleType,
      isEmailVerified: updatedRider.isEmailVerified,
      isPhoneVerified: updatedRider.isPhoneVerified
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// @desc    Change rider password
// @route   PUT /api/riders/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const rider = await Rider.findById(req.rider.id);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, rider.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    rider.password = await bcrypt.hash(newPassword, salt);
    await rider.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

// @desc    Update rider availability
// @route   PUT /api/riders/availability
// @access  Private
const updateAvailability = async (req, res) => {
  try {
    const rider = await Rider.findById(req.rider.id);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    const { isAvailable } = req.body;
    rider.isAvailable = isAvailable;
    await rider.save();

    res.json({ isAvailable: rider.isAvailable });
  } catch (error) {
    console.error('Error in updateAvailability:', error);
    res.status(500).json({ message: 'Failed to update availability' });
  }
};

// @desc    Get rider statistics
// @route   GET /api/riders/statistics
// @access  Private
const getStatistics = async (req, res) => {
  try {
    const rider = await Rider.findById(req.rider.id);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    const pickups = await Pickup.find({ rider: rider._id });
    const completedPickups = pickups.filter(pickup => pickup.status === 'completed');

    const statistics = {
      totalPickups: rider.totalPickups,
      completedPickups: rider.completedPickups,
      rating: rider.rating,
      rewardPoints: rider.rewardPoints,
      todayPickups: pickups.filter(pickup => {
        const today = new Date();
        const pickupDate = new Date(pickup.scheduledDate);
        return pickupDate.toDateString() === today.toDateString();
      }).length,
      pendingPickups: pickups.filter(pickup => pickup.status === 'pending').length
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error in getStatistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  updateAvailability,
  getStatistics
};
