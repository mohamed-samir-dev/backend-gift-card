const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  card:        { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
  payment:     { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  invoice:     { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  price:       { type: Number, required: true },
  status:      { type: String, enum: ['pending', 'completed', 'cancelled', 'refunded'], default: 'pending' },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
