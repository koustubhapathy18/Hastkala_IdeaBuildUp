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
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { location, specialty, upi, image, isVerified: true },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/artisans — get all artisans (from User model, role=artisan)
router.get('/', async (req, res) => {
  try {
    const artisans = await User.find({ role: 'artisan' }).select('-password');
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

