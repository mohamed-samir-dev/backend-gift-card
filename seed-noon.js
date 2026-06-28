require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // 1. Find or create "نون" category
  let category = await Category.findOne({ slug: 'noon' });
  if (!category) {
    category = await Category.create({
      name: 'نون',
      slug: 'noon',
      image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1782683241/ChatGPT_Image_29_%D9%8A%D9%88%D9%86%D9%8A%D9%88_2026_12_45_33_%D8%B5_clia0u.webp',
      isActive: true,
    });
    console.log('✅ Category created:', category.name);
  } else {
    console.log('ℹ️  Category already exists:', category.name);
  }

  // 2. Upsert product with brief
  const product = await Product.findOneAndUpdate(
    { title: 'بطاقة نون 100 ريال' },
    {
      category: category._id,
      title: 'بطاقة نون 100 ريال',
      brief: 'بطاقة رقمية لمتجر نون – استلم الكود فوراً واشتري من ملايين المنتجات في السعودية',
      description: `بطاقة نون الرقمية – 100 ريال سعودي

العلامة: نون
نوع البطاقة: بطاقة رقمية
الاستخدام: متجر نون السعودية
طريقة الاستلام: كود رقمي يتم إرساله فوراً بعد إتمام عملية الشراء
الصلاحية: 12 شهر من تاريخ الشراء
المنطقة: المملكة العربية السعودية فقط

بطاقة نون الرقمية هي الحل الأمثل للتسوق عبر منصة نون، واحدة من أكبر منصات التسوق الإلكتروني في الشرق الأوسط. اشحن رصيدك بسهولة واستمتع بالتسوق من بين ملايين المنتجات في مختلف الفئات كالإلكترونيات، الأزياء، المنزل، والجمال. اختر الفئة المناسبة واستلم الكود رقمياً فور إتمام الدفع، دون الحاجة للانتظار أو الشحن. مثالية كهدية لأصدقائك وعائلتك في أي مناسبة.`,
      image: 'https://res.cloudinary.com/dv6fig2ci/image/upload/v1782683241/ChatGPT_Image_29_%D9%8A%D9%88%D9%86%D9%8A%D9%88_2026_12_45_33_%D8%B5_clia0u.webp',
      price: 100,
      currency: 'SAR',
      isActive: true,
    },
    { upsert: true, new: true }
  );

  console.log('✅ Product upserted:', product.title, '| ID:', product._id);
  await mongoose.disconnect();
  console.log('🔌 Disconnected');
}

seed().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
