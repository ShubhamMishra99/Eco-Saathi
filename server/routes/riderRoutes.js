const express = require('express');
const router = express.Router();
const RiderController = require('../controllers/riderController');

// Signup and Login
router.post('/signup', RiderController.signup);
router.post('/login', RiderController.login);

// Remove OTP routes
// router.post('/send-otp', RiderController.sendOtp);
// router.post('/verify-otp', RiderController.verifyOtp);

module.exports = router;
