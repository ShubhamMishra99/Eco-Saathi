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



  console.log('Login attempt for email:', email);

  // Basic validation

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    console.log('Login successful for user:', email);

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
    console.error('Login error:', err);
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

// Export the socket initializer as well
exports.setSocketInstance = setSocketInstance;
