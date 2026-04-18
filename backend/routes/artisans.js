const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { verifyAuthContext, verifyArtisan } = require('../middleware/roleCheck');

// GET /api/artisans/me — return logged-in artisan's profile
router.get('/me', verifyAuthContext, verifyArtisan, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/artisans/me — save onboarding profile data
router.put('/me', verifyAuthContext, verifyArtisan, async (req, res) => {
  try {
    const { location, specialty, upi, image } = req.body;
    // Only update allowed fields — isVerified is set server-side only
    const updateFields = {};
    if (location !== undefined) updateFields.location = location;
    if (specialty !== undefined) updateFields.specialty = specialty;
    if (upi !== undefined) updateFields.upi = upi;
    if (image !== undefined) updateFields.image = image;
    updateFields.isVerified = true; // Server controls this
    
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/artisans — get all artisans (public listing, safe fields only)
router.get('/', async (req, res) => {
  try {
    const artisans = await User.find({ role: 'artisan', status: 'active' })
      .select('name image location specialty isVerified');
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

