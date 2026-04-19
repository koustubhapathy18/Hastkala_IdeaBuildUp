const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');
const Product = require('./models/Product');

require('dotenv').config();

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be provided in the .env file');
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create a dummy product
  const product = new Product({
    title: 'Test Integration Product',
    artisan: 'Ram Kumar',
    village: 'Jaipur',
    price: 1500,
    category: 'Textiles'
  });
  await product.save();
  const productId = product._id.toString();
  console.log('Created dummy product:', productId);

  // Call the API
  const form = new FormData();
  form.append('artisanName', 'Ram Kumar');
  form.append('village', 'Jaipur');
  form.append('craftType', 'textiles');
  form.append('story', 'A test story');
  form.append('productId', productId);

  try {
    const res = await axios.post('http://localhost:5001/api/truthmark/register', form, {
      headers: form.getHeaders(),
    });
    console.log('Registered TruthMark:', res.data.truthMarkCode);
    
    // Check DB again
    const updatedProduct = await Product.findById(productId);
    console.log('Product link established?', updatedProduct.truthMarkCode === res.data.truthMarkCode);
    if(updatedProduct.truthMarkCode === res.data.truthMarkCode) {
        console.log('✅ Success: Product correctly linked to TruthMark');
    } else {
        console.log('❌ Failed: Product not linked');
    }
  } catch (err) {
    console.error('API Error:', err.response ? err.response.data : err.message);
  } finally {
    // Cleanup
    await Product.findByIdAndDelete(productId);
    await mongoose.disconnect();
  }
}

run();
