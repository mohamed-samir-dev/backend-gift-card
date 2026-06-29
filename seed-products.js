require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Card = require('./models/Card');

// ============================================================
//  بيانات المنتجات — عدّل وأضف هنا براحتك
// ============================================================
const productsData = [
  {
    // ---- بيانات المنتج ----
    categorySlug: 'noon',
    title: 'بطاقة نون 100 ريال',
    brief: 'بطاقة رقمية لمتجر نون – استلم الكود فوراً',
    description: 'بطاقة نون الرقمية للتسوق من ملايين المنتجات في السعودية.',
    details: {
      'العلامة': 'نون',
      'نوع البطاقة': 'بطاقة رقمية',
      'الاستخدام': 'متجر نون السعودية',
      'طريقة الاستلام': 'كود رقمي فوري',
      'الصلاحية': '12 شهر',
      'المنطقة': 'المملكة العربية السعودية',
    },
    image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1782683241/ChatGPT_Image_29_%D9%8A%D9%88%D9%86%D9%8A%D9%88_2026_12_45_33_%D8%B5_clia0u.webp',
    price: 100,
    currency: 'SAR',
    isActive: true,
    unlimitedStock: false,
    // ---- الكروت الخاصة بهذا المنتج ----
    cards: [
      { pin: 'NOON-XXXX-0001', expiry: '12/2026' },
      { pin: 'NOON-XXXX-0002', expiry: '12/2026' },
      { pin: 'NOON-XXXX-0003', expiry: '12/2026' },
    ],
  },

  {
    categorySlug: 'noon',
    title: 'بطاقة نون 200 ريال',
    brief: 'بطاقة رقمية لمتجر نون بقيمة 200 ريال',
    description: 'بطاقة نون الرقمية للتسوق من ملايين المنتجات في السعودية.',
    details: {
      'العلامة': 'نون',
      'نوع البطاقة': 'بطاقة رقمية',
      'الاستخدام': 'متجر نون السعودية',
      'طريقة الاستلام': 'كود رقمي فوري',
      'الصلاحية': '12 شهر',
      'المنطقة': 'المملكة العربية السعودية',
    },
    image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1782683241/ChatGPT_Image_29_%D9%8A%D9%88%D9%86%D9%8A%D9%88_2026_12_45_33_%D8%B5_clia0u.webp',
    price: 200,
    currency: 'SAR',
    isActive: true,
    unlimitedStock: false,
    cards: [
      { pin: 'NOON-YYYY-0001', expiry: '12/2026' },
      { pin: 'NOON-YYYY-0002', expiry: '12/2026' },
    ],
  },

  // أضف منتجات أكثر هنا بنفس الشكل 👇
  // {
  //   categorySlug: 'slug-الكاتيجوري',
  //   title: '...',
  //   brief: '...',
  //   description: '...',
  //   details: { ... },
  //   image: '...',
  //   price: 0,
  //   currency: 'SAR',
  //   isActive: true,
  //   unlimitedStock: false,
  //   cards: [
  //     { pin: '...', expiry: '...', cardNumber: '...', cvv: '...', serial: '...' },
  //   ],
  // },
];

// ============================================================

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  for (const data of productsData) {
    // 1. جيب الكاتيجوري
    const category = await Category.findOne({ slug: data.categorySlug });
    if (!category) {
      console.warn(`⚠️  Category "${data.categorySlug}" not found — skipping product "${data.title}"`);
      continue;
    }

    // 2. Upsert المنتج
    const { cards, categorySlug, ...productFields } = data;
    const product = await Product.findOneAndUpdate(
      { title: data.title },
      { ...productFields, category: category._id },
      { upsert: true, new: true }
    );
    console.log(`✅ Product upserted: ${product.title} | ID: ${product._id}`);

    // 3. أضف الكروت الجديدة فقط (تجنب التكرار بالـ pin)
    if (cards && cards.length > 0) {
      let added = 0;
      for (const cardData of cards) {
        const filter = cardData.pin
          ? { product: product._id, pin: cardData.pin }
          : { product: product._id, cardNumber: cardData.cardNumber };

        const exists = await Card.findOne(filter);
        if (!exists) {
          await Card.create({ ...cardData, product: product._id, status: 'available' });
          added++;
        }
      }
      console.log(`   📦 Cards added: ${added} (skipped duplicates: ${cards.length - added})`);
    }
  }

  await mongoose.disconnect();
  console.log('🔌 Disconnected');
}

seed().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
