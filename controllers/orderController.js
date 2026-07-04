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
    const { productId, couponCode, paymentMethod = 'cod', idempotencyKey } = req.body;

    // 1. Validate productId to prevent NoSQL injection
    if (!mongoose.isValidObjectId(productId)) throw new Error('Invalid product ID');

    // 2. Idempotency check — same key returns same result without double-charging
    if (idempotencyKey) {
      const existing = await Order.findOne({ idempotencyKey, user: req.user._id })
        .populate('invoice').populate('card');
      if (existing) {
        await session.abortTransaction();
        return res.status(200).json({
          order: existing,
          card: { pin: existing.card?.pin, serial: existing.card?.serial, cardNumber: existing.card?.cardNumber },
          invoice: existing.invoice,
        });
      }
    }

    const product = await Product.findById(productId).session(session);
    if (!product || !product.isActive) throw new Error('Product not available');

    // 3. Validate & calculate coupon discount from DB — never trust frontend price
    let couponDiscount = 0;
    let appliedCouponCode = null;
    if (couponCode) {
      const coupon = await require('../models/Coupon').findOne({
        code: String(couponCode).toUpperCase(),
        isActive: true,
      }).session(session);
      if (!coupon) throw new Error('Invalid or expired coupon');
      if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('Coupon has expired');
      if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) throw new Error('Coupon usage limit reached');
      couponDiscount = coupon.type === 'percentage'
        ? (product.price * coupon.value) / 100
        : coupon.value;
      couponDiscount = Math.min(couponDiscount, product.price); // discount can't exceed price
      appliedCouponCode = coupon.code;
      coupon.usedCount += 1;
      await coupon.save({ session });
    }

    // 4. Server-side price calculation
    const setting = await Setting.findOne().session(session);
    const tax = setting?.tax || 0;
    const subtotal = product.price - couponDiscount;
    const total = subtotal + (subtotal * tax) / 100;

    // 5. Reserve one available card atomically
    let card = await Card.findOneAndUpdate(
      { product: productId, status: 'available' },
      { status: 'reserved' },
      { new: true, session }
    );
    if (!card) {
      if (!product.unlimitedStock) throw new Error('Out of stock');
      card = (await Card.create([{ product: productId, status: 'reserved' }], { session }))[0];
    }

    // 6. Wallet deduction — only after stock is confirmed
    let wallet = null;
    if (paymentMethod === 'wallet') {
      wallet = await Wallet.findOne({ user: req.user._id }).session(session);
      if (!wallet || wallet.balance < total) {
        const current = wallet?.balance || 0;
        throw new Error(
          `Insufficient balance. Current: ${current.toFixed(2)}, Required: ${total.toFixed(2)}, Top up: ${(total - current).toFixed(2)}`
        );
      }
      if (wallet.balance - total < 0) throw new Error('Balance cannot go negative');
      const balanceBefore = wallet.balance;
      wallet.balance = parseFloat((wallet.balance - total).toFixed(10));
      wallet.totalSpent += total;
      await wallet.save({ session });

      await WalletTransaction.create([{
        user: req.user._id,
        wallet: wallet._id,
        type: 'purchase',
        amount: total,
        balanceBefore,
        balanceAfter: wallet.balance,
        order: null, // will update after order is created
        status: 'completed',
      }], { session });
    }

    // 7. Create order
    const isWallet = paymentMethod === 'wallet';
    const order = (await Order.create([{
      user: req.user._id,
      product: productId,
      card: card._id,
      price: total,
      status: isWallet ? 'completed' : 'pending',
      deliveredAt: isWallet ? new Date() : null,
      idempotencyKey: idempotencyKey || undefined,
      couponCode: appliedCouponCode,
      couponDiscount,
    }], { session }))[0];

    // 8. Update WalletTransaction with orderId
    if (isWallet) {
      await WalletTransaction.findOneAndUpdate(
        { wallet: wallet._id, type: 'purchase', order: null },
        { order: order._id },
        { session, sort: { createdAt: -1 } }
      );
    }

    // 9. Create invoice
    const invoice = (await Invoice.create([{
      order: order._id,
      invoiceNumber: generateInvoiceNumber(),
      subtotal,
      tax: (subtotal * tax) / 100,
      total,
      paymentMethod,
    }], { session }))[0];

    order.invoice = invoice._id;
    await order.save({ session });

    // 10. Mark card as sold
    card.status = isWallet ? 'sold' : 'reserved';
    card.soldTo = isWallet ? req.user._id : undefined;
    card.soldAt = isWallet ? new Date() : undefined;
    await card.save({ session });

    // 11. Notification with full details
    await Notification.create([{
      user: req.user._id,
      title: 'Order Completed',
      body: isWallet
        ? `تم خصم ${total.toFixed(2)} من محفظتك. الرصيد الحالي: ${wallet.balance.toFixed(2)}`
        : `Your order for ${product.title} has been placed.`,
    }], { session });

    await session.commitTransaction();

    res.status(201).json({
      order,
      card: { pin: card.pin, serial: card.serial, cardNumber: card.cardNumber },
      invoice,
      ...(isWallet && { newBalance: wallet.balance }),
    });
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
