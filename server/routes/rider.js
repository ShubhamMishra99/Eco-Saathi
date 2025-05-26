const express = require('express');
const bcrypt = require('bcrypt');
const Rider = require('../models/Rider');
const router = express.Router();

// Register Rider
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone, vehicleType } = req.body;

    // Validate required fields (you can add more robust validation)
    if (!username || !email || !password || !phone || !vehicleType) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if rider exists
    const existingRider = await Rider.findOne({ email });
    if (existingRider) {
      return res.status(400).json({ message: 'Rider already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Rider
    const newRider = new Rider({
      username,
      email,
      password: hashedPassword,
      phone,
      vehicleType,
    });

    await newRider.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rider Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find rider by email
    const rider = await Rider.findOne({ email });
    if (!rider) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Return rider info (later you can return JWT token here)
    res.json({ 
      message: 'Login successful', 
      rider: {
        id: rider._id,
        username: rider.username,
        email: rider.email,
        phone: rider.phone,
        vehicleType: rider.vehicleType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
