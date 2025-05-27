const Rider = require('../models/Rider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      vehicleNumber,
      vehicleType,
      licenseNumber,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !vehicleNumber ||
      !vehicleType ||
      !licenseNumber
    ) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingRider = await Rider.findOne({ email });
    if (existingRider) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRider = await Rider.create({
      name,
      email,
      phone,
      password: hashedPassword,
      vehicleNumber,
      vehicleType,
      licenseNumber,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const token = jwt.sign({ id: newRider._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({ success: true, token, rider: newRider });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const rider = await Rider.findOne({ email });
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ success: true, token, rider });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};
