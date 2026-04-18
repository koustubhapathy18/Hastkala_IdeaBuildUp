require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // assuming models/User.js exists

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const email = 'elon@gmail.com';
    const newPassword = 'elon.123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    const result = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (result) {
      console.log(`Password updated successfully for ${email}`);
    } else {
      console.log(`User with email ${email} not found`);
    }

  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    mongoose.disconnect();
  }
}

resetPassword();
