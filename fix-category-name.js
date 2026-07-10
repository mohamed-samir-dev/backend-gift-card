require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Category.updateOne({ slug: 'pubg', name: 'pubg' }, { name: 'PUBG Mobile' });
  console.log(result.modifiedCount ? '✅ Fixed: pubg → PUBG Mobile' : '⚠️ Nothing updated (already correct or not found)');
  await mongoose.disconnect();
}

fix().catch(console.error);
