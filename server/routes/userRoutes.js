const express = require('express');
const router = express.Router();
const { signup, login, schedulePickup, getPickups } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.post('/schedule-pickup', auth, schedulePickup);
router.get('/pickups', auth, getPickups);

module.exports = router;
