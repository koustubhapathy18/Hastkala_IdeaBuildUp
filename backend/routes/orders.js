const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Auth middleware (duplicated for simplicity, but ideally shared)
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


// POST create order
router.post('/', async (req, res) => {
  try {
    const { customerInfo, items, totalAmount } = req.body;
    
    const newOrder = new Order({
      customerInfo,
      items,
      totalAmount
    });
    
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET my orders (for buyer)
router.get('/me', auth, async (req, res) => {
  try {
    // Find orders where customerInfo.email matches the logged-in user's email
    // Or if we have a userId in the Order model, use that.
    // Given the current Order model uses customerInfo.email:
    const orders = await Order.find({ 'customerInfo.email': req.user.email });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all orders (for admin)
router.get('/', async (req, res) => {

  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
