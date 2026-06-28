const Payment = require('../models/Payment');

exports.getMyPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort('-createdAt');
  res.json(payments);
};

exports.getAllPayments = async (req, res) => {
  const payments = await Payment.find().populate('user', 'name email').sort('-createdAt');
  res.json(payments);
};

exports.getPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('user', 'name email');
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json(payment);
};
