const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artisan: { type: String, required: true },
  village: { type: String },
  state: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  image2: { type: String },
  artisanImage: { type: String },
  authentic: { type: Boolean, default: true },
  category: { type: String },
  material: { type: String },
  isBestseller: { type: Boolean, default: false },
  priceBreakdown: {
    artisan: { type: Number },
    platformFee: { type: Number },
    middleman: { type: Number }
  },
  stock: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
