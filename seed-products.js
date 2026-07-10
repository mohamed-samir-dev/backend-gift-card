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
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 100 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 100 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 100 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '100 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 100,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 200 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 200 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 200 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '200 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 200,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 300 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 300 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 300 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '300 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 300,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 400 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 400 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 400 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '400 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 400,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 500 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 500 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 500 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '500 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 500,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 600 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 600 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 600 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '600 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 600,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 700 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 700 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 700 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '700 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 700,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 800 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 800 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 800 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '800 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 800,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 900 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 900 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 900 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '900 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 900,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},{
  categorySlug: 'playstation',
  title: 'بطاقة بلايستيشن 1000 ريال',
  brief: 'بطاقة رقمية لمتجر PlayStation Store بقيمة 1000 ريال',
  description: 'اشحن رصيد PlayStation Store بسهولة باستخدام بطاقة رقمية بقيمة 1000 ريال سعودي، مع استلام الكود فورًا بعد تأكيد الطلب.',
  details: {
    'المنصة': 'PlayStation',
    'نوع البطاقة': 'بطاقة رقمية',
    'القيمة': '1000 ريال سعودي',
    'طريقة الاستلام': 'كود رقمي فوري',
    'الاستخدام': 'شحن رصيد PlayStation Store وشراء الألعاب والإضافات والاشتراكات',
    'الصلاحية': '12 شهر',
    'المنطقة': 'السعودية',
  },
  image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1783707316/ChatGPT_Image_Jul_4_2026_04_03_03_PM_ecf0j1.webp',
  price: 1000,
  currency: 'SAR',
  isActive: true,
  unlimitedStock: false,
  cards: [
    { pin: 'PSN-YYYY-0001', expiry: '12/2027' },
    { pin: 'PSN-YYYY-0002', expiry: '12/2027' },
  ],
},
];

// ============================================================

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  for (const data of productsData) {
    // 1. جيب الكاتيجوري أو أنشئها إذا ما وُجدت
    const category = await Category.findOneAndUpdate(
      { slug: data.categorySlug },
      { $setOnInsert: { name: data.categoryName ?? data.categorySlug, slug: data.categorySlug, isActive: true } },
      { upsert: true, new: true }
    );
    console.log(`📂 Category: ${category.name} (${category._id})`);

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
