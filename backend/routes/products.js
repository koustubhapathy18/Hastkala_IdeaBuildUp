const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');

// JWT auth middleware
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'hastkala_secret');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all products or filter by artisan
router.get('/', async (req, res) => {
  try {
    const { artisan } = req.query;
    let query = {};
    if (artisan) {
      query.artisan = artisan;
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }

});

// GET my products (as an artisan)
router.get('/me', auth, async (req, res) => {
  try {
    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Access denied. Artisans only.' });
    }
    const products = await Product.find({ artisan: req.user.name });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── AI Price Advisor ────────────────────────────────────────────────────────
// GET /api/products/price-advice?category=Textiles&material=Silk&workHours=20&complexity=medium
router.get('/price-advice', async (req, res) => {
  try {
    const { category, material = '', workHours = 0, complexity = 'medium' } = req.query;
    if (!category) return res.status(400).json({ message: 'category is required' });

    const hours = Math.max(0, Number(workHours) || 0);

    // ── 1. Material base cost (₹ per item) ─────────────────────────────────
    const materialCosts = {
      // Textiles
      silk: 1200, 'assam silk': 1400, 'pure silk': 1500, cotton: 350, 'pure cotton': 400,
      'silk & cotton': 800, 'velvet & gold thread': 1800, wool: 900,
      // Metals
      brass: 900, 'metal alloy': 1400, iron: 600, copper: 700, silver: 3000,
      // Craft
      canvas: 300, paper: 150, clay: 200, 'terracotta': 250,
      wood: 500, bamboo: 250, 'fabric & sequins': 600, fabric: 400,
    };
    const materialKey = material.toLowerCase().trim();
    // Exact match → then partial match → fallback per category
    let materialCost = materialCosts[materialKey];
    if (!materialCost) {
      for (const [k, v] of Object.entries(materialCosts)) {
        if (materialKey.includes(k) || k.includes(materialKey)) { materialCost = v; break; }
      }
    }
    if (!materialCost) {
      const matFallback = { Textiles: 600, Pottery: 200, Decor: 400, Paintings: 250,
                            Metalwork: 900, Jewellery: 1200, 'Wood Carving': 450 };
      materialCost = matFallback[category] || 350;
    }

    // ── 2. Labour cost ──────────────────────────────────────────────────────
    // Fair artisan wage ₹150/hr; if no hours provided, estimate from category
    const hourlyRate = 150;
    const estimatedHours = hours > 0 ? hours
      : { Textiles: 24, Pottery: 10, Decor: 8, Paintings: 20,
          Metalwork: 30, Jewellery: 18, 'Wood Carving': 16 }[category] || 12;
    const laborCost = Math.round(estimatedHours * hourlyRate);

    // ── 3. Complexity multiplier (how intricate is the work) ────────────────
    const complexityMult = { low: 1.1, medium: 1.4, high: 1.85, expert: 2.5 };
    const cMult = complexityMult[complexity] || 1.4;

    // ── 4. Category skill premium ──────────────────────────────────────────
    const skillPremium = { Metalwork: 2.2, Jewellery: 2.5, Textiles: 1.9,
                           Paintings: 2.0, Pottery: 1.6, Decor: 1.4,
                           'Wood Carving': 1.8 };
    const sPremium = skillPremium[category] || 1.5;

    // ── 5. Base computed price ─────────────────────────────────────────────
    const baseCost     = materialCost + laborCost;
    const computedPrice = Math.round(baseCost * cMult * sPremium);

    // ── 6. Market calibration from DB ─────────────────────────────────────
    const dbProducts = await Product.find({ category }).select('price');
    const prices  = dbProducts.map(p => p.price).sort((a, b) => a - b);
    const pct = (arr, p) => {
      if (!arr.length) return computedPrice;
      const idx   = (p / 100) * (arr.length - 1);
      const lo    = Math.floor(idx), hi = Math.ceil(idx);
      return Math.round(arr[lo] + (arr[hi] - arr[lo]) * (idx - lo));
    };
    const marketMedian = pct(prices, 50);
    const marketP25    = prices.length ? pct(prices, 25) : Math.round(computedPrice * 0.75);
    const marketP75    = prices.length ? pct(prices, 75) : Math.round(computedPrice * 1.35);

    // Blend: 60% our formula + 40% market median for calibration
    const recommended = prices.length
      ? Math.round(computedPrice * 0.6 + marketMedian * 0.4)
      : computedPrice;

    // Range: ±15% around recommended, clamped to market P25/P75 if available
    const rangeLow  = Math.max(Math.round(recommended * 0.85), prices.length ? marketP25 : Math.round(recommended * 0.75));
    const rangeHigh = Math.min(Math.round(recommended * 1.25), prices.length ? marketP75 : Math.round(recommended * 1.45));
    const min = prices.length ? Math.min(prices[0], Math.round(recommended * 0.6)) : Math.round(recommended * 0.5);
    const max = prices.length ? Math.max(prices[prices.length - 1], Math.round(recommended * 1.6)) : Math.round(recommended * 1.8);

    res.json({
      category,
      sampleSize:  prices.length,
      recommended: Math.round(recommended / 50) * 50,  // round to nearest ₹50
      rangeLow:    Math.round(rangeLow  / 50) * 50,
      rangeHigh:   Math.round(rangeHigh / 50) * 50,
      min:         Math.round(min / 50) * 50,
      max:         Math.round(max / 50) * 50,
      breakdown: {
        materialCost,
        laborCost,
        hoursUsed:   estimatedHours,
        complexity,
        skillPremium: sPremium,
        marketSampleSize: prices.length,
      },
      isFallback: false,
    });
  } catch (err) {
    console.error('Price advice error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — create a new product (artisan only)
router.post('/', auth, async (req, res) => {
  try {
    const artisan = await User.findById(req.user.id);
    if (!artisan || artisan.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can list products' });
    }

    const { title, price, category, material, image, image2, description, stock } = req.body;

    const product = new Product({
      title,
      price: Number(price),
      category,
      material,
      image,
      image2: image2 || '',
      artisan: artisan.name,
      artisanImage: artisan.image,
      village: artisan.location && typeof artisan.location === 'string' && artisan.location.includes(',') ? artisan.location.split(',')[0]?.trim() : (artisan.location || ''),
      state: artisan.location && typeof artisan.location === 'string' && artisan.location.includes(',') ? artisan.location.split(',')[1]?.trim() : '',

      authentic: true,
      isBestseller: false,
      priceBreakdown: { artisan: Number(price), platformFee: 0, middleman: 0 }
    });

    const saved = await product.save();

    // Also push to artisan's liveProducts
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        liveProducts: {
          name: title,
          price: Number(price),
          stock: Number(stock) || 10,
          views: 0,
          orders: 0,
          image
        }
      }
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only the artisan who created the product can update it
    if (product.artisan !== req.user.name) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const { title, price, category, material, stock, image } = req.body;
    
    product.title = title || product.title;
    product.price = price || product.price;
    product.category = category || product.category;
    product.material = material || product.material;
    product.stock = stock || product.stock;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    
    // Also update in the user's liveProducts array if necessary
    const user = await User.findById(req.user.id);
    if (user && user.liveProducts) {
      const liveProductIndex = user.liveProducts.findIndex(p => p.name === product.title);
      if (liveProductIndex !== -1) {
        user.liveProducts[liveProductIndex] = {
          name: product.title,
          price: product.price,
          stock: product.stock,
          image: product.image,
          views: user.liveProducts[liveProductIndex].views || 0,
          orders: user.liveProducts[liveProductIndex].orders || 0
        };
        await user.save();
      }
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;


