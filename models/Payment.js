const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gateway:       { type: String, required: true },
  transactionId: { type: String },
  invoiceId:     { type: String },
  amount:        { type: Number, required: true },
  currency:      { type: String, default: 'USD' },
  status:        { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  rawResponse:   { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
