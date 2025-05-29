const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protectUser } = require('../middleware/userMiddleware');
const Pickup = require('../models/Pickup');

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes
router.use(protectUser);
router.post('/schedule-pickup', userController.schedulePickup);
router.get('/pickups', userController.getPickups);
router.get('/statistics', userController.getStatistics);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);

module.exports = router;
