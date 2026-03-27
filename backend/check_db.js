const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/hastkala';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    console.log(`Total products: ${products.length}`);
    const blankProductImages = products.filter(p => !p.image || p.image === '' || p.image.includes('placeholder') || p.image === 'null');
    console.log(`Products with blank images: ${blankProductImages.length}`);
    if (blankProductImages.length > 0) {
      blankProductImages.forEach(p => console.log(p.title, p.image));
    }
    
    // Check artisans / users
    const users = await db.collection('users').find({}).toArray();
    const blankUserImages = users.filter(u => !u.image || u.image === '' || u.image.includes('placeholder') || u.image === 'null');
    console.log(`Users with blank images: ${blankUserImages.length}`);
    if (blankUserImages.length > 0) {
      blankUserImages.forEach(u => console.log(u.name, u.image));
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
