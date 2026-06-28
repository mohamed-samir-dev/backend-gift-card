const Coupon = require('../models/Coupon');

exports.getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

exports.createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
};

exports.updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  res.json(coupon);
};

exports.deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Coupon deleted' });
};

exports.validateCoupon = async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) return res.status(404).json({ message: 'Invalid coupon' });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon limit reached' });
  res.json({ type: coupon.type, value: coupon.value });
};
