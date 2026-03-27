const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'artisan', 'admin'], default: 'buyer' },
  isBanned: { type: Boolean, default: false },
  // Artisan profile fields (filled during onboarding)
  location: { type: String },
  specialty: { type: String },
  upi: { type: String },
  image: { type: String, default: 'https://images.unsplash.com/photo-1620188989504-20d0f4d34cd6?q=80&w=2070&auto=format&fit=crop' },
  isVerified: { type: Boolean, default: false },
  metrics: {
    totalEarnings:      { type: Number, default: 0 },
    priceMirrorSavings: { type: Number, default: 0 },
    pendingOrders:      { type: Number, default: 0 },
    shippingToday:      { type: Number, default: 0 }
  },
  liveProducts: [
    {
      name:   { type: String },
      price:  { type: Number },
      stock:  { type: Number },
      views:  { type: Number },
      orders: { type: Number },
      image:  { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

