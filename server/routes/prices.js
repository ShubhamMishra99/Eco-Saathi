const express = require('express');
const router = express.Router();
const PriceItem = require('../models/PriceChart');

// GET all price items
router.get('/', async (req, res) => {
  try {
    const prices = await PriceItem.find();
    res.json(prices);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
