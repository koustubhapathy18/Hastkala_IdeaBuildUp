const express = require('express');
const router = express.Router();
const multer = require('multer');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const TruthMark = require('../models/TruthMark');
const { generateTruthMarkCode, craftCodes } = require('../utils/truthmarkHelper');
const { uploadToPinata } = require('../utils/pinataHelper');
const jwt = require('jsonwebtoken');

// ── Auth Middleware ──
const auth = (req, res, next) => {
  const token = req.header('x-auth-token') || (req.header('Authorization') && req.header('Authorization').split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hastkala_secret');
    if (decoded.role !== 'artisan') return res.status(403).json({ message: 'Only artisans can register TruthMark' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ── Multer Config ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Photo must be an image file'), false);
      }
    }
    if (file.fieldname === 'video') {
      if (!file.mimetype.startsWith('video/')) {
        return cb(new Error('Video must be a video file'), false);
      }
    }
    cb(null, true);
  }
});

// ──────────────────────────────────────────────
//  POST /api/truthmark/register
//  Artisan registers a product for TruthMark
// ──────────────────────────────────────────────
router.post('/register',
  auth,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { artisanName, village, craftType, story, lat, lng, productId } = req.body;

      // Validation
      if (!artisanName || !village || !craftType) {
        return res.status(400).json({
          message: 'artisanName, village, and craftType are required'
        });
      }

      // 1. Upload files to Pinata / local fallback
      let photoIPFS = '';
      let videoIPFS = '';

      if (req.files?.photo?.[0]) {
        photoIPFS = await uploadToPinata(
          req.files.photo[0].path,
          req.files.photo[0].originalname
        );
      }

      if (req.files?.video?.[0]) {
        videoIPFS = await uploadToPinata(
          req.files.video[0].path,
          req.files.video[0].originalname
        );
      }

      // 2. Generate unique TruthMark code
      let truthMarkCode;
      let isUnique = false;
      while (!isUnique) {
        truthMarkCode = generateTruthMarkCode(craftType);
        const existing = await TruthMark.findOne({ truthMarkCode });
        if (!existing) isUnique = true;
      }

      // 3. Generate QR Code
      const qrDir = path.join(__dirname, '..', 'qrcodes');
      if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

      const qrFileName = `${truthMarkCode}.png`;
      const qrFilePath = path.join(qrDir, qrFileName);
      const verifyUrl = `http://localhost:5173/verify/${truthMarkCode}`;

      await QRCode.toFile(qrFilePath, verifyUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        }
      });

      // 4. Save to MongoDB
      const record = new TruthMark({
        truthMarkCode,
        artisanName,
        village,
        gpsCoords: {
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null
        },
        craftType: craftType.toLowerCase(),
        story: story || '',
        photoIPFS,
        videoIPFS,
        qrCodePath: `/qrcodes/${qrFileName}`
      });

      await record.save();

      // 5. Update Product if productId is provided
      if (productId) {
        const Product = require('../models/Product');
        await Product.findByIdAndUpdate(productId, { truthMarkCode });
        console.log(`✅ Product ${productId} retroactively linked to ${truthMarkCode}`);
      }

      console.log(`✅ TruthMark registered: ${truthMarkCode} for ${artisanName}`);

      res.status(201).json({
        message: 'TruthMark registered successfully!',
        truthMarkCode,
        qrCodeUrl: `/qrcodes/${qrFileName}`,
        verifyUrl,
        photoIPFS,
        videoIPFS
      });

    } catch (err) {
      console.error('TruthMark registration error:', err);
      res.status(500).json({ message: err.message });
    }
  }
);

// ──────────────────────────────────────────────
//  GET /api/verify/:code
//  Buyer verification lookup
// ──────────────────────────────────────────────
router.get('/:code', async (req, res) => {
  try {
    const product = await TruthMark.findOne({
      truthMarkCode: req.params.code.toUpperCase()
    });

    if (!product) {
      return res.json({
        valid: false,
        message: 'No product found with this TruthMark code.'
      });
    }

    res.json({
      valid: true,
      data: {
        truthMarkCode: product.truthMarkCode,
        artisanName: product.artisanName,
        village: product.village,
        gpsCoords: product.gpsCoords,
        craftType: product.craftType,
        story: product.story,
        photoIPFS: product.photoIPFS,
        videoIPFS: product.videoIPFS,
        qrCodePath: product.qrCodePath,
        createdAt: product.createdAt
      }
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ──────────────────────────────────────────────
//  GET /api/truthmark/list
//  List all TruthMark entries (for admin/debug)
// ──────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const records = await TruthMark.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
