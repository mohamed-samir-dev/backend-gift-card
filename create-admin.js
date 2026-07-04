require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Wallet = require('./models/Wallet');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const email = 'admin@cardzone.com';
  const password = 'Admin@123456';

  const exists = await User.findOne({ email });
  if (exists) {
    // لو موجود بالفعل، حوّله لأدمن
    exists.role = 'admin';
    exists.password = password;
    await exists.save();
    console.log('✅ Existing user updated to admin');
  } else {
    const user = await User.create({ name: 'Admin', email, password, role: 'admin', isVerified: true });
    await Wallet.create({ user: user._id });
    console.log('✅ Admin user created');
  }

  console.log('📧 Email:   ', email);
  console.log('🔑 Password:', password);

  await mongoose.disconnect();
}

createAdmin().catch(err => { console.error('❌', err.message); process.exit(1); });
