const Invoice = require('../models/Invoice');
const Order = require('../models/Order');

exports.getMyInvoices = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).select('_id');
  const ids = orders.map(o => o._id);
  const invoices = await Invoice.find({ order: { $in: ids } }).populate('order').sort('-createdAt');
  res.json(invoices);
};

exports.getInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate({ path: 'order', populate: { path: 'product user' } });
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json(invoice);
};

exports.getAllInvoices = async (req, res) => {
  const invoices = await Invoice.find()
    .populate({ path: 'order', populate: { path: 'product user', select: 'title name email' } })
    .sort('-createdAt');
  res.json(invoices);
};
