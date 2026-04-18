const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');

const { verifyAuthContext, verifyArtisan, verifyActiveStatus } = require('../middleware/roleCheck');

// GET all products or filter by search/category/artisan
// GET all products or filter by search/category/artisan
router.get('/', async (req, res, next) => {
  try {
    const { artisan, search, category, limit = 12, page = 1 } = req.query;
    let query = {};
    
    if (artisan) {
      query.artisan = artisan;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      // Escape special regex characters to prevent ReDoS attacks
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Powerful startup-style search across multiple fields
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { category: { $regex: escapedSearch, $options: 'i' } },
        { artisan: { $regex: escapedSearch, $options: 'i' } },
        { material: { $regex: escapedSearch, $options: 'i' } }
      ];
    }
    
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 50);
    const skipNum = (pageNum - 1) * limitNum;

    const [products, totalItems] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skipNum).limit(limitNum).lean(),
      Product.countDocuments(query)
    ]);
    
    res.json({
      data: products,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum),
        currentPage: pageNum,
        pageSize: limitNum
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET my products (as an artisan)
router.get('/me', verifyAuthContext, verifyArtisan, async (req, res) => {
  try {
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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured in backend environment.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const hours = Math.max(0, Number(workHours) || 0);

    // ── 1. Market calibration from DB ─────────────────────────────────────
    const dbProducts = await Product.find({ category }).select('price');
    const prices  = dbProducts.map(p => p.price).sort((a, b) => a - b);
    const pct = (arr, p) => {
      if (!arr.length) return null;
      const idx   = (p / 100) * (arr.length - 1);
      const lo    = Math.floor(idx), hi = Math.ceil(idx);
      return Math.round(arr[lo] + (arr[hi] - arr[lo]) * (idx - lo));
    };
    const marketMedian = prices.length ? pct(prices, 50) : null;
    const marketP25    = prices.length ? pct(prices, 25) : null;
    const marketP75    = prices.length ? pct(prices, 75) : null;

    // ── 2. Construct Prompt for Gemini ─────────────────────────────────────
    const systemInstruction = `
You are an expert ecommerce price evaluator for Indian artisans for a platform called Hastkala.
Your objective is to provide a fair, profitable, and market-calibrated recommended price in INR (₹) for handmade products.
The inputs are:
- Category: ${category}
- Material: ${material || 'Standard'}
- Work Hours: ${hours > 0 ? hours : 'Unknown'}
- Complexity: ${complexity}

Context from our actual store:
- Market Minimum (25th percentile): ₹${marketP25 || 'Unknown'}
- Market Median: ₹${marketMedian || 'Unknown'}
- Market Maximum (75th percentile): ₹${marketP75 || 'Unknown'}
- Current items in category: ${prices.length}

Compute a fair Recommended Price, min/max range, and cost breakdowns (material/labor).
If market data exists, heavily calibrate your recommendation towards it so it matches real buyer expectations, but respect the true artistic value of high complexity and work hours (assume a fair hourly wage is ~₹150).
Output strictly in the specified JSON schema.
`;

    // ── 3. Call Gemini Model ────────────────────────────────────────────────
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Analyze the product and generate pricing JSON.',
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            recommended: { type: "INTEGER", description: "Recommended selling price in INR" },
            rangeLow: { type: "INTEGER", description: "Lower boundary of the sweet spot range in INR" },
            rangeHigh: { type: "INTEGER", description: "Upper boundary of the sweet spot range in INR" },
            min: { type: "INTEGER", description: "Absolute minimum acceptable price in INR" },
            max: { type: "INTEGER", description: "Absolute maximum price in INR" },
            breakdown: {
              type: "OBJECT",
              properties: {
                materialCost: { type: "INTEGER" },
                laborCost: { type: "INTEGER" }
              },
              required: ["materialCost", "laborCost"]
            }
          },
          required: ["recommended", "rangeLow", "rangeHigh", "min", "max", "breakdown"]
        }
      }
    });

    const aiResult = JSON.parse(response.text);

    // ── 4. Return Output matching Frontend schema ───────────────────────────
    res.json({
      category,
      sampleSize: prices.length,
      recommended: Math.round(aiResult.recommended / 50) * 50, // snap to ₹50
      rangeLow: Math.round(aiResult.rangeLow / 50) * 50,
      rangeHigh: Math.round(aiResult.rangeHigh / 50) * 50,
      min: Math.round(aiResult.min / 50) * 50,
      max: Math.round(aiResult.max / 50) * 50,
      breakdown: {
        ...aiResult.breakdown,
        hoursUsed: hours || 12,
        complexity,
        skillPremium: 1.5,
        marketSampleSize: prices.length,
      },
      isFallback: false,
    });
  } catch (err) {
    console.error('AI Price advice error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET single product with Recommendation Engine
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Recommendation Engine: Find Similar Masterpieces
    const relatedProducts = await Product.find({
      _id: { $ne: product._id }, // Exclude current product
      $or: [
        { category: product.category },
        { artisan: product.artisan },
        { material: product.material }
      ]
    }).limit(4);

    // Attach relatedProducts inside the payload
    res.json({
      ...product.toObject(),
      relatedProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — create a new product (artisan only)
router.post('/', verifyAuthContext, verifyArtisan, verifyActiveStatus, async (req, res) => {
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
router.put('/:id', verifyAuthContext, verifyArtisan, verifyActiveStatus, async (req, res) => {
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


