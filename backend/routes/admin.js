const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { verifyAuthContext, verifyAdmin } = require('../middleware/roleCheck');

// GET /api/admin/users
// Fetch all buyers and artisans for the Admin Dashboard
router.get('/users', verifyAuthContext, verifyAdmin, async (req, res) => {
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
router.put('/users/:id/ban', verifyAuthContext, verifyAdmin, async (req, res) => {
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

// GET /api/admin/artisans/pending
// Fetch all pending applications for seller role
router.get('/artisans/pending', verifyAuthContext, verifyAdmin, async (req, res) => {
  try {
    const pendingArtisans = await User.find({ role: 'artisan', status: 'pending' }).select('-password').sort({ createdAt: -1 });
    res.json(pendingArtisans);
  } catch (err) {
    console.error('Error fetching pending artisans:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/artisans/:id/status
// Approve or Reject an artisan
router.put('/artisans/:id/status', verifyAuthContext, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active or rejected.' });
    }
    
    const artisan = await User.findById(req.params.id);
    if (!artisan) return res.status(404).json({ message: 'Artisan not found' });
    if (artisan.role !== 'artisan') return res.status(400).json({ message: 'User is not an artisan/seller.' });

    artisan.status = status;
    await artisan.save();
    
    res.json({ message: `Seller application ${status}`, artisan });
  } catch (err) {
    console.error('Error updating artisan status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
