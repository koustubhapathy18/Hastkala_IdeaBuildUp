const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and attach user id
const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hastkala_secret');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/artisans/me — return logged-in artisan's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/artisans/me — save onboarding profile data
router.put('/me', auth, async (req, res) => {
  try {
    const { location, specialty, upi, image } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
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

