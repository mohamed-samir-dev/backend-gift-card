require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Product.updateMany({}, { unlimitedStock: true });
  console.log(`✅ Updated ${result.modifiedCount} products → unlimitedStock: true`);
  await mongoose.disconnect();
}

run().catch(console.error);
