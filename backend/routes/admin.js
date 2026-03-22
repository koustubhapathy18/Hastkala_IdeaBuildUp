const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Auth middleware (duplicated as per existing files)
const auth = (req, res, next) => {
  const token = req.header('x-auth-token') || (req.header('Authorization') && req.header('Authorization').split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hastkala_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// GET /api/admin/users
// Fetch all buyers and artisans for the Admin Dashboard
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['buyer', 'artisan', 'admin'] } })
                            .select('-password')
                            .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/users/:id/ban
// Toggle ban status for a buyer or artisan
router.put('/users/:id/ban', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'admin') {
       return res.status(403).json({ message: 'Cannot suspend another administrator account.' });
    }

    user.isBanned = !user.isBanned;
    await user.save();
    
    res.json({ message: `User ${user.isBanned ? 'suspended' : 'restored'} successfully`, user });
  } catch (error) {
    console.error('Error toggling ban:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
