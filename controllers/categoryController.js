const Category = require('../models/Category');
const slugify = require('slugify');

exports.getCategories = async (req, res) => {
  const cats = await Category.find({ isActive: true });
  res.json(cats);
};

exports.getAllCategories = async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
};

exports.createCategory = async (req, res) => {
  const { name, image } = req.body;
  const slug = slugify(name, { lower: true });
  const cat = await Category.create({ name, slug, image });
  res.status(201).json(cat);
};

exports.updateCategory = async (req, res) => {
  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
};
