require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const featuredTitles = [
  'بطاقة نون 200 ريال',
  'بطاقة iTunes 500 ريال',
  'شدات ببجي 400 ريال',
  'بطاقة بلايستيشن 800 ريال',
  'بطاقة جوجل بلاي 1000 ريال',
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  // reset all featured first
  await Product.updateMany({}, { featured: false });
  const result = await Product.updateMany(
    { title: { $in: featuredTitles } },
    { featured: true }
  );
  console.log(`✅ Featured updated: ${result.modifiedCount} products`);

  // show what was matched
  const featured = await Product.find({ featured: true }, 'title price');
  featured.forEach(p => console.log(` - ${p.title} (${p.price} SAR)`));

  await mongoose.disconnect();
}

main().catch(err => { console.error(err.message); process.exit(1); });
