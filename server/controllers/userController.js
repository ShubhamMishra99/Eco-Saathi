const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/jwt');
const Pickup = require('../models/Pickup');

let io; // Socket.io instance holder

// Allow server to inject the io instance
const setSocketInstance = (ioInstance) => {
  io = ioInstance;
};

// ========================
// LOGIN CONTROLLER
// ========================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ========================
// SIGNUP CONTROLLER
// ========================
exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        isEmailVerified: newUser.isEmailVerified,
        isPhoneVerified: newUser.isPhoneVerified,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// ========================
// SCHEDULE PICKUP CONTROLLER
// ========================
exports.schedulePickup = async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user.id;
    
    // Combine request data with user ID
    const pickupData = {
      ...req.body,
      user: userId,
      status: 'pending'
    };

    // Create and save pickup
    const newPickup = new Pickup(pickupData);
    await newPickup.save();

    // Emit real-time event to riders
    if (io) {
      io.emit('new-pickup', newPickup);
    }

    res.status(201).json({ message: 'Pickup scheduled successfully', pickup: newPickup });
  } catch (err) {
    console.error('Error scheduling pickup:', err);
    res.status(500).json({ 
      message: 'Failed to schedule pickup',
      error: err.message 
    });
  }
};

// ========================
// GET PICKUPS CONTROLLER
// ========================
exports.getPickups = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all pickups for the user and populate rider information
    const pickups = await Pickup.find({ user: userId })
      .populate('rider', 'name phone')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(pickups);
  } catch (err) {
    console.error('Error fetching pickups:', err);
    res.status(500).json({ 
      message: 'Failed to fetch pickups',
      error: err.message 
    });
  }
};

// ========================
// GET USER PROFILE
// ========================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's pickups for statistics
    const pickups = await Pickup.find({ user: user._id });
    const completedPickups = pickups.filter(pickup => pickup.status === 'completed');

    // Calculate reward points
    const rewardPoints = completedPickups.reduce((total, pickup) => {
      // Base points (10 per kg)
      let points = Math.floor((pickup.actualWeight || 0) * 10);
      // Bonus points (50 points per 10kg)
      points += Math.floor((pickup.actualWeight || 0) / 10) * 50;
      return total + points;
    }, 0);

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      joinedDate: user.createdAt,
      totalPickups: pickups.length,
      rewardPoints
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// ========================
// UPDATE USER PROFILE
// ========================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, phone } = req.body;

    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.isEmailVerified = false; // Reset email verification if email is changed
    }

    // Check if phone is being changed
    if (phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
      user.isPhoneVerified = false; // Reset phone verification if phone is changed
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    const updatedUser = await user.save();

    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isEmailVerified: updatedUser.isEmailVerified,
      isPhoneVerified: updatedUser.isPhoneVerified
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// ========================
// CHANGE PASSWORD
// ========================
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

// ========================
// GET USER STATISTICS
// ========================
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const pickups = await Pickup.find({ user: userId });

    const statistics = {
      totalPickups: pickups.length,
      pendingRequests: pickups.filter(pickup => pickup.status === 'pending').length,
      completed: pickups.filter(pickup => pickup.status === 'completed').length,
      rewardPoints: pickups
        .filter(pickup => pickup.status === 'completed')
        .reduce((total, pickup) => {
          // Base points (10 per kg)
          let points = Math.floor((pickup.actualWeight || 0) * 10);
          // Bonus points (50 points per 10kg)
          points += Math.floor((pickup.actualWeight || 0) / 10) * 50;
          return total + points;
        }, 0)
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
};

// Export the socket initializer as well
exports.setSocketInstance = setSocketInstance;
