require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function countArtisans() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await User.countDocuments({ role: 'artisan' });
    console.log(`ARTISAN_COUNT:${count}`);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

countArtisans();
