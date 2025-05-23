const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// POST: Update collector's location
router.post('/update', async (req, res) => {
  const { collectorId, lat, lng } = req.body;
  if (!collectorId || !lat || !lng) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Create new location entry (adds to history)
    const newLocation = new Location({
      collectorId,
      lat,
      lng,
      updatedAt: new Date()
    });

    const saved = await newLocation.save();

    res.json({ message: 'Location saved', data: saved });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
