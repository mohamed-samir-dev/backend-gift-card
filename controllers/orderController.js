const mongoose = require('mongoose');
const Order = require('../models/Order');
const Card = require('../models/Card');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const generateInvoiceNumber = require('../utils/generateInvoiceNumber');
const Setting = require('../models/Setting');

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { productId, couponDiscount = 0 } = req.body;
    const product = await Product.findById(productId).session(session);
    if (!product || !product.isActive) throw new Error('Product not available');

    // Reserve one available card atomically
    let card = await Card.findOneAndUpdate(
      { product: productId, status: 'available' },
      { status: 'reserved' },
      { new: true, session }
    );
    if (!card) {
      if (!product.unlimitedStock) throw new Error('No cards in stock');
      // unlimitedStock: create a virtual card
      card = (await Card.create([{ product: productId, status: 'reserved' }], { session }))[0];
    }

    const wallet = await Wallet.findOne({ user: req.user._id }).session(session);
    const setting = await Setting.findOne().session(session);
    const tax = setting?.tax || 0;
    const subtotal = product.price - couponDiscount;
    const total = subtotal + (subtotal * tax) / 100;

    if (wallet.balance < total) throw new Error('Insufficient wallet balance');

    const balanceBefore = wallet.balance;
    wallet.balance -= total;
    wallet.totalSpent += total;
    await wallet.save({ session });

    const order = (await Order.create([{
      user: req.user._id, product: productId, card: card._id, price: total, status: 'completed', deliveredAt: new Date(),
    }], { session }))[0];

    const invoice = (await Invoice.create([{
      order: order._id,
      invoiceNumber: generateInvoiceNumber(),
      subtotal,
      tax: (subtotal * tax) / 100,
      total,
      paymentMethod: 'wallet',
    }], { session }))[0];

    order.invoice = invoice._id;
    await order.save({ session });

    card.status = 'sold';
    card.soldTo = req.user._id;
    card.soldAt = new Date();
    await card.save({ session });

    await WalletTransaction.create([{
      user: req.user._id,
      wallet: wallet._id,
      type: 'purchase',
      amount: total,
      balanceBefore,
      balanceAfter: wallet.balance,
      order: order._id,
      status: 'completed',
    }], { session });

    await Notification.create([{
      user: req.user._id,
      title: 'Order Completed',
      body: `Your order for ${product.title} has been delivered.`,
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ order, card: { pin: card.pin, serial: card.serial, cardNumber: card.cardNumber }, invoice });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('product', 'title image price')
    .populate('invoice')
    .sort('-createdAt');
  res.json(orders);
};

exports.getOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .populate('product card invoice');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('product', 'title')
    .sort('-createdAt');
  res.json(orders);
};
