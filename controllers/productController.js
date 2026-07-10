const Product = require('../models/Product');
const Card = require('../models/Card');

exports.getProducts = async (req, res) => {
  const filter = { isActive: true };
  if (req.query.featured === 'true') filter.featured = true;
  const products = await Product.find(filter).populate('category', 'name slug').lean();
  const ids = products.map(p => p._id);
  const counts = await Card.aggregate([
    { $match: { product: { $in: ids }, status: 'available' } },
    { $group: { _id: '$product', count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]));
  products.forEach(p => { p.stock = p.unlimitedStock ? 20000 : (countMap[p._id.toString()] ?? 0); });
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug').lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });
    product.stock = product.unlimitedStock ? 20000 : await Card.countDocuments({ product: product._id, status: 'available' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};
