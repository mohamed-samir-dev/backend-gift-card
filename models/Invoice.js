const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  order:         { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  subtotal:      { type: Number, required: true },
  tax:           { type: Number, default: 0 },
  total:         { type: Number, required: true },
  paymentMethod: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
