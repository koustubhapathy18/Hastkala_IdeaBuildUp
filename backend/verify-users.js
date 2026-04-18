require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function ensureUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: false,
    });
    console.log('Connected to MongoDB');

    const users = [
      {
        email: 'sam@gmail.com',
        passwordRaw: 'artisan123',
        role: 'artisan',
        name: 'Sam Artisan'
      },
      {
        email: 'elon@gmail.com',
        passwordRaw: 'elon.123',
        role: 'buyer',
        name: 'Elon Buyer'
      },
      {
        email: 'koustub@hastkala.com',
        passwordRaw: 'admin.123',
        role: 'admin',
        name: 'Koustub Admin'
      }
    ];

    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.passwordRaw, 10);
      const email = u.email.toLowerCase().trim();
      
      const updateData = {
        name: u.name,
        password: hashedPassword,
        role: u.role,
        status: 'active',
        isVerified: true
      };

      await User.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true, upsert: true }
      );
      
      console.log(`Ensured user exists: ${email} with role: ${u.role}`);
    }

  } catch (error) {
    console.error('Error ensuring users:', error);
  } finally {
    mongoose.disconnect();
    console.log('Done.');
  }
}

ensureUsers();
